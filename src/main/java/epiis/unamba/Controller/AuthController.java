package epiis.unamba.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import epiis.unamba.DTO.AuthResponse;
import epiis.unamba.DTO.LoginRequest;
import epiis.unamba.DTO.RegisterRequest;
import epiis.unamba.model.Usuario;
import epiis.unamba.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Registrar usuario
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Usuario usuario = authService.registrar(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "mensaje", "Usuario registrado correctamente",
                    "usuario", usuario
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("mensaje", e.getMessage() != null ? e.getMessage() : "Error al registrar usuario")
            );
        }
    }

    // Iniciar sesión
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);

            return ResponseEntity.ok(
                Map.of(
                    "mensaje", "Inicio de sesión exitoso",
                    "token", response.getToken(),
                    "rol", response.getRol() != null ? response.getRol() : "" // Opcional por si devuelves el rol
                )
            );
            
        } catch (BadCredentialsException e) {
            // 🟢 Captura credenciales incorrectas y devuelve 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("mensaje", "Usuario o contraseña incorrectos")
            );
        } catch (Exception e) {
            // 🟢 Captura excepciones personalizadas lanzadas desde tu AuthService
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("mensaje", "Usuario o contraseña incorrectos")
            );
        }
    }
}