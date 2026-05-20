package com.transplantchain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class MatchRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    private String donorAbhaHash;
    private String recipientAbhaHash;
    private String donorName;
    private String recipientName;
    private String donorBloodGroup;
    private String recipientBloodGroup;
    private Integer donorAge;
    private Integer recipientAge;
    private String donorHla;
    private String recipientHla;

    private String hospitalId;
    private String hospitalName;
    private String organType;
    private Double compatibilityScore;

    private String transactionHash;
    private Long blockNumber;
    private String status;          // CONFIRMED, PENDING, MANUAL_OVERRIDE
    private LocalDateTime matchedAt;

    private String matchType;       // AI_RECOMMENDED, MANUAL

    public MatchRecord() {
        this.matchedAt = LocalDateTime.now();
        this.status = "CONFIRMED";
        this.matchType = "AI_RECOMMENDED";
    }
}
