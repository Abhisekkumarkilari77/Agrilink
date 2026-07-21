package com.agrilink.security;

import com.agrilink.entity.auth.User;
import com.agrilink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find user by email or mobile
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByMobile(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email or mobile: " + username)));

        return CustomUserDetails.build(user);
    }
}
