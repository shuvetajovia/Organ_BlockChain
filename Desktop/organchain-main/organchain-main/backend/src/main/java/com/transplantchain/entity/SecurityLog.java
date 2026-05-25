package com.transplantchain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class SecurityLog {
    @Id
    private String eventId;
    private String type;
    private String sourceIp;
    private String riskLevel;
    private String timestamp;
    @Setter
    private String status; // ACTIVE, BANNED, DISMISSED
    private String reason;

}
