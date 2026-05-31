package com.transplantchain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(unique = true, nullable = false)
    private String abhaId;
    
    private String name;
    private String password;
    
    public Patient() {}
    public Patient(String abhaId, String password, String name) {
        this.abhaId = abhaId;
        this.password = password;
        this.name = name;
    }
}
