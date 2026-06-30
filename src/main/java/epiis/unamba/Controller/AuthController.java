package epiis.unamba.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epiis.unamba.DTO.AuthResponse;
import epiis.unamba.DTO.LoginRequest;
import epiis.unamba.DTO.RegisterRequest;
import epiis.unamba.Model.Usuario;
import epiis.unamba.Service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Registrar usuario
    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody RegisterRequest request) {

        Usuario usuario = authService.registrar(request);

        return new ResponseEntity<>(usuario, HttpStatus.CREATED);
    }

    // Iniciar sesión
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

}
