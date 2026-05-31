from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import re
import fitz
from io import BytesIO



app = Flask(__name__)
@app.route('/')
def home():
    return jsonify({
        "message": "Organ Blockchain ML Service Running"
    })
CORS(app)

# ======================================
# REGEX PATTERNS
# ======================================

AADHAR_REGEX = r'\b\d{4}\s?\d{4}\s?\d{4}\b'
PHONE_REGEX = r'\b(?:\+?91[\-\s]?)?[789]\d{9}\b'
NAME_REGEX = r'\b(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b'


# ======================================
# HELPER FUNCTIONS
# ======================================

def mask_sensitive_text(text):

    text = re.sub(AADHAR_REGEX, '[REDACTED_AADHAR]', text)
    text = re.sub(PHONE_REGEX, '[REDACTED_PHONE]', text)
    text = re.sub(NAME_REGEX, '[REDACTED_NAME]', text)

    return text


def validate_json_payload(data, required_fields):

    if not data:
        return False, "Missing JSON payload"

    for field in required_fields:

        if field not in data:
            return False, f"Missing required field: {field}"

    return True, None


# ======================================
# MASK PII ROUTE
# ======================================

@app.route('/mask-pii', methods=['POST'])
def mask_pii():

    try:

        # --------------------------------------
        # PDF Upload Processing
        # --------------------------------------

        if 'file' in request.files:

            file = request.files['file']

            if file.filename == '':
                return jsonify({
                    'error': 'No file selected'
                }), 400

            if not file.filename.lower().endswith('.pdf'):
                return jsonify({
                    'error': 'Only PDF files are supported'
                }), 400

            pdf_bytes = file.read()

            input_pdf = fitz.open(
                stream=pdf_bytes,
                filetype="pdf"
            )

            output_pdf = fitz.open()

            for page_num in range(len(input_pdf)):

                page = input_pdf.load_page(page_num)

                original_text = page.get_text()

                masked_text = mask_sensitive_text(original_text)

                new_page = output_pdf.new_page(
                    width=page.rect.width,
                    height=page.rect.height
                )

                new_page.insert_text(
                    (50, 50),
                    masked_text,
                    fontsize=10
                )

            output_stream = BytesIO()

            output_pdf.save(output_stream)

            output_stream.seek(0)

            return send_file(
                output_stream,
                mimetype='application/pdf',
                as_attachment=True,
                download_name='masked_document.pdf'
            )

        # --------------------------------------
        # JSON TEXT MASKING
        # --------------------------------------

        data = request.get_json(silent=True)

        valid, error = validate_json_payload(
            data,
            ['text']
        )

        if not valid:

            return jsonify({
                'error': error
            }), 400

        masked_text = mask_sensitive_text(data['text'])

        return jsonify({
            'safe_text': masked_text
        })

    except Exception as e:

        return jsonify({
            'error': str(e)
        }), 500


# ======================================
# ORGAN VIABILITY PREDICTION
# ======================================

@app.route('/predict-viability', methods=['POST'])
def predict_viability():

    try:

        data = request.get_json()

        valid, error = validate_json_payload(
            data,
            [
                'donor_age',
                'ischemic_time_hours',
                'hla_mismatch_score'
            ]
        )

        if not valid:

            return jsonify({
                'error': error
            }), 400

        donor_age = float(data['donor_age'])

        ischemic_time = float(
            data['ischemic_time_hours']
        )

        hla_mismatch = int(
            data['hla_mismatch_score']
        )

        hospital_id = data.get(
            'hospital_id'
        )

        # --------------------------------------
        # HEURISTIC SCORING
        # --------------------------------------

        age_penalty = max(
            0,
            (donor_age - 40) * 0.5
        )

        time_penalty = max(
            0,
            (ischemic_time - 4.0) * 2.0
        )

        hla_penalty = hla_mismatch * 5.0

        score = (
            100.0
            - age_penalty
            - time_penalty
            - hla_penalty
        )

        # Same hospital bonus

        if hospital_id:

            score += 3.0

        score = max(
            0.0,
            min(100.0, score)
        )

        result = {
            'success_probability_percent':
                round(score, 2),

            'hospital_id':
                hospital_id,

            'proximity_bonus_applied':
                bool(hospital_id)
        }

        return jsonify(result)

    except Exception as e:

        return jsonify({
            'error': str(e)
        }), 500


# ======================================
# DONOR MATCH FILTER
# ======================================

@app.route('/match-filter', methods=['POST'])
def match_filter():

    try:

        data = request.get_json()

        valid, error = validate_json_payload(
            data,
            ['donors', 'recipients']
        )

        if not valid:

            return jsonify({
                'error': error
            }), 400

        hospital_id = data.get(
            'hospital_id'
        )

        donors = data['donors']

        recipients = data['recipients']

        ABO_COMPAT = {
            'O-': ['O-','O+','A-','A+','B-','B+','AB-','AB+'],
            'O+': ['O+','A+','B+','AB+'],
            'A-': ['A-','A+','AB-','AB+'],
            'A+': ['A+','AB+'],
            'B-': ['B-','B+','AB-','AB+'],
            'B+': ['B+','AB+'],
            'AB-': ['AB-','AB+'],
            'AB+': ['AB+'],
        }

        matches = []

        for donor in donors:

            donor_blood = donor.get(
                'bloodGroup',
                ''
            )

            donor_hla = set(
                filter(
                    None,
                    donor.get(
                        'hlaMarkers',
                        ''
                    ).split(',')
                )
            )

            donor_age = donor.get(
                'age',
                40
            )

            donor_hospital = donor.get(
                'hospitalId',
                ''
            )

            for recipient in recipients:

                recip_blood = recipient.get(
                    'bloodGroup',
                    ''
                )

                recip_hla = set(
                    filter(
                        None,
                        recipient.get(
                            'hlaMarkers',
                            ''
                        ).split(',')
                    )
                )

                recip_age = recipient.get(
                    'age',
                    40
                )

                recip_hospital = recipient.get(
                    'hospitalId',
                    ''
                )

                compat_list = ABO_COMPAT.get(
                    donor_blood,
                    []
                )

                if recip_blood not in compat_list:
                    continue

                score = 0

                # ABO Score

                if donor_blood == recip_blood:
                    score += 40
                else:
                    score += 25

                # HLA Score

                shared = len(
                    donor_hla & recip_hla
                )

                score += min(
                    shared * 10,
                    60
                )

                # Age Penalty

                age_diff = abs(
                    donor_age - recip_age
                )

                score -= min(
                    age_diff * 0.5,
                    15
                )

                # Hospital Bonus

                same_hospital = False

                if hospital_id:

                    if (
                        donor_hospital == hospital_id
                        and recip_hospital == hospital_id
                    ):

                        score += 15

                        same_hospital = True

                    elif (
                        donor_hospital == hospital_id
                        or recip_hospital == hospital_id
                    ):

                        score += 5

                if score > 0:

                    matches.append({

                        'donorId':
                            donor.get(
                                'abhaId',
                                ''
                            ),

                        'recipientId':
                            recipient.get(
                                'abhaId',
                                ''
                            ),

                        'donorName':
                            donor.get(
                                'name',
                                ''
                            ),

                        'recipientName':
                            recipient.get(
                                'name',
                                ''
                            ),

                        'score':
                            round(score, 1),

                        'hlaShared':
                            shared,

                        'sameHospital':
                            same_hospital,

                        'donorBlood':
                            donor_blood,

                        'recipientBlood':
                            recip_blood
                    })

        matches.sort(
            key=lambda x: x['score'],
            reverse=True
        )

        return jsonify({

            'hospital_id':
                hospital_id,

            'totalMatches':
                len(matches),

            'matches':
                matches[:20]
        })

    except Exception as e:

        return jsonify({
            'error': str(e)
        }), 500


# ======================================
# MAIN
# ======================================

if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False
    )