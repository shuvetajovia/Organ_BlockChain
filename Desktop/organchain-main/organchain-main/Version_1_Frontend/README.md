🧬 OrganChain: Decentralized National Organ Registry
Empowering Transparency, Security, and Fairness in Life-Saving Transplants.

OrganChain is a high-integrity, blockchain-powered medical infrastructure designed to eliminate corruption, data silos, and administrative friction in the Indian organ transplant ecosystem. Built with a focus on NOTTO (National Organ and Tissue Transplant Organization) compliance, it leverages smart contracts to ensure a zero-discretion matching process.

🚀 The Problem
Current organ registries suffer from:
Lack of Trust: High potential for waitlist manipulation.
Data Fragmentation: Critical medical data is trapped in separate hospital silos.
Administrative Latency: Paper-heavy workflows delay life-saving procedures.

🛡️ The Solution: The "Trust-Protocol"
OrganChain solves these issues by moving the registry from a central database to a Decentralized Ledger.
Immutability: Once a match is made, it is permanent. No one can "jump the queue."
Transparency: Every transaction has a unique TX Hash for a 100% audit trail.
Governance: Uses Multi-Sig Consensus to protect against single-point-of-failure hacks.
🛠️ Tech StackFrontend: 
->React.js / Tailwind CSS (Modern Clinical Elegance UI)
->Blockchain: Solidity (Smart Contracts), Ganache / Truffle (Dev Suite)
->Identity: ABHA Integrated (National Health Authority
->Security: $AES-256$ (Data at rest), $SHA-256$ (Hashing), $RSA-4096$ (Node Handshakes)

🖥️ Feature Suite
🏛️ General Public Portal
Automated Awareness: High-impact Hero Slider with 1s transitions for government scheme visibility (PM-JAY).
Legal Repository: A 75-question FAQ suite and document repository mirroring THOTA 1994 laws.
Secure Gateway: Integrated Network Login for Patients and Administrators.

🏥 Patient Dashboard
Medical Identity Vault: Secure storage of ABHA ID and HLA Markers, cryptographically hashed on-chain.
Node Discovery: Directory of 140+ Authorized Nodes with real-time 'Verify Node' (RSA Handshake) functionality.
Legal Compliance: Direct access to the Top 20 Official NOTTO Forms (Living, Deceased, and Institutional).

⚔️ Admin Command Center
->Node Registry: Live Hardware Telemetry for all hospital servers.
->Multi-Sig Halt: Governance protocol requiring $M \geq \frac{2}{3} \times N$ consensus to suspend suspicious nodes.
->Audit Ledger: Real-time blockchain explorer for tracking every Match and Pledge event.
->Security Sentinel: Interactive Threat Map and intrusion logs for $24/7$ network resilience.

⚙️ Core Workflow
1.Enrollment: Patient registers via ABHA ID; consent is recorded as a permanent Pledge on the ledger.
2.Verification: Authorized Hospital Nodes verify clinical data and write the hash to the next block.
3.Matching: The MATCH_EXEC Smart Contract automatically pairs donors with the most compatible recipient.
4.Finalization: A blockchain-signed Digital Certificate is issued for the transplant procedure.

🛡️ Governance & Security Logic
"Don't Trust, Verify."
To prevent unauthorized access, OrganChain implements:
->Asymmetric Encryption: Every hospital node uses a Public/Private Key pair for data integrity.
->Consensus Integrity: The network maintains a 99.8% Consensus score, ensuring all 142 nodes are perfectly synced.
->Threat Mitigation: Security logs track Signature Mismatches and auto-blacklist malicious IPs.

📦 Installation & Setup
Clone the Repo:
Bash
git clone https://github.com/your-repo/OrganChain.git
Install Dependencies:
Bash
npm install
Deploy Smart Contracts (Ganache):
Bash
truffle migrate --reset
Start the Application:
Bash
npm start
