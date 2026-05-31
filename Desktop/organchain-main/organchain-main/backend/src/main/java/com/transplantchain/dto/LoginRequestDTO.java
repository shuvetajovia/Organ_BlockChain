package com.transplantchain.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @NotBlank(message = "AbhaId is required")
    private String abhaId;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;
    private String otp;
    public LoginRequestDTO() {}

    public String getAbhaId() { return abhaId; }
    public void setAbhaId(String abhaId) { this.abhaId = abhaId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) {this.otp = otp; }
}
