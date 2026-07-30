package epiis.unamba.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epiis.unamba.DTO.AuthResponse;
import epiis.unamba.DTO.LoginRequest;
import epiis.unamba.DTO.RegisterRequest;
import epiis.unamba.model.Usuario;
import epiis.unamba.service.AuthService;

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

        Usuario usuario = authService.registrar(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            java.util.Map.of(
                "mensaje", "Usuario registrado correctamente",
                "usuario", usuario
            )
        );
    }

    // Iniciar sesión
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
            java.util.Map.of(
                "mensaje", "Inicio de sesión exitoso",
                "token", response.getToken()
            )
        );
    }

}
