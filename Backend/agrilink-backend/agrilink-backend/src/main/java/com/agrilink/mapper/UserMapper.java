package com.agrilink.mapper;

import com.agrilink.dto.auth.JwtAuthenticationResponse.UserDto;
import com.agrilink.entity.auth.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .name(user.getName())
                .role(user.getRole())
                .status(user.getStatus())
                .farmName(user.getFarmName())
                .build();
    }
}
