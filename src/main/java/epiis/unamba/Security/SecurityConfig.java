package epiis.unamba.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // Ya no es necesario inyectar userDetailsService aquí, Spring lo detecta automáticamente
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                    // Endpoints públicos de autenticación
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll() 
                    .requestMatchers("/uploads/**", "/images/**").permitAll()

                    // Productos: GET público, CUD solo ADMIN
                    .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/productos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")

                    // Categorías: GET público, los demás ADMIN
                    .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                    .requestMatchers("/api/categorias/**").hasRole("ADMIN")

                    // Gestión de compras y perfiles de cliente
                    .requestMatchers(HttpMethod.POST, "/api/pedidos/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/detalle-pedidos/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/clientes/**").permitAll()
                    .requestMatchers("/api/pedidos/**").hasAnyRole("ADMIN", "CLIENTE")
                    .requestMatchers("/api/detalle-pedidos/**").hasAnyRole("ADMIN", "CLIENTE")
                    .requestMatchers("/api/clientes/**").hasAnyRole("ADMIN", "CLIENTE")

                    .anyRequest().authenticated()
            )

            // Se remueve .authenticationProvider(...) ya que Spring Security lo hace automáticamente
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}