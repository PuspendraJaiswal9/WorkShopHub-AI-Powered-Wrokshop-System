package com.example.api_gateway.config;

import com.example.api_gateway.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeExchange(exchanges -> exchanges

                        // Public endpoints
                        .pathMatchers("/user/login", "/user/register", "/user/test", "/eureka/**",
                                "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                                "/swagger-resources/**", "/webjars/**")
                        .permitAll()

                        // ===================== Workshop Service =====================
                        // ADMIN: Add, Update, Delete, GetAll, GetById
                        // USER : GetAll, GetById
                        .pathMatchers(HttpMethod.POST, "/api/workshops").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/workshops/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/workshops/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/workshops", "/api/workshops/**").hasAnyRole("USER", "ADMIN")

                        // ===================== Fare Service =====================
                        // ADMIN: Add, Update, Delete
                        // USER : Only GetById
                        .pathMatchers(HttpMethod.POST, "/fares").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/fares/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/fares/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/fares/**").hasAnyRole("USER", "ADMIN")

                        // ===================== Booking Service =====================
                        // USER & ADMIN both can perform all operations
                        .pathMatchers("/api/bookings/**").hasAnyRole("USER", "ADMIN")

                        // ===================== Chatbot (AdminTicketController) =====================
                        // Only ADMIN can perform all operations
                        .pathMatchers("/admin/tickets/**").hasRole("ADMIN")

                        // Any other request must be authenticated
                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
