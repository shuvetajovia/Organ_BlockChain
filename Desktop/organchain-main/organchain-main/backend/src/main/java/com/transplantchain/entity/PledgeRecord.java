package com.transplantchain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@NoArgsConstructor
public class PledgeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    private String abhaId;
    private String abhaHash;
    private String documentHash;
    private String ipfsCid;
    private Integer organBitmap;
    private String witnessName;
    private String witnessContact;
    private String transactionHash;

    private String patientName;
    private Integer patientAge;
    private String bloodGroup;

    // Phase 12
    private String hospitalId;
    private String hospitalName;
    private String hlaMarkers;   // comma-separated, e.g. "A1,A2,B7,DR3,DR4,B44"
    private String organ;        // e.g. "Kidney", "Liver"
    private String role;         // "DONOR" or "RECIPIENT"
    private Long blockNumber;

}
