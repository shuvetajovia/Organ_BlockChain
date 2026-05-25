package com.transplantchain.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PledgeVerifyRequest {
    // Getters and Setters
    private String abhaHash;
    private String documentHash;
    private String cid;
    private int organBitmap;
    private String witnessSignature;

    private String abhaId;
    private String witnessName;
    private String witnessContact;
    private String patientName;
    private int patientAge;
    private String bloodGroup;

    // Phase 12 additions
    private String hospitalId;
    private String hospitalName;
    private String hlaMarkers;
    private String organ;
    private String role;
}
