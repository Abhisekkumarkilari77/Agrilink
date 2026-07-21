package com.agrilink.dto.auth;

import com.agrilink.enums.AccountStatus;
import com.agrilink.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String token;
    private UserDto user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private String id;
        private String email;
        private String mobile;
        private String name;
        private RoleType role;
        private AccountStatus status;
        private String farmName;
    }
}
