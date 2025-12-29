package com.invoicingproject.spine.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration class for PasswordEncoder bean
 * Separate from SecurityConfig to avoid circular dependencies
 */
@Configuration
public class PasswordEncoderConfig {

    /**
     * Bean for password encoding using BCrypt
     * 
     * @return PasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
