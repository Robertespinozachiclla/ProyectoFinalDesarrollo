package epiis.unamba.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import epiis.unamba.DTO.AuthResponse;
import epiis.unamba.DTO.LoginRequest;
import epiis.unamba.DTO.RegisterRequest;
import epiis.unamba.Model.Usuario;
import epiis.unamba.Repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UsuarioRepository usuarioRepository,
            UsuarioService usuarioService,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {

        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // Registrar usuario
    public Usuario registrar(RegisterRequest request) {

        Usuario usuario = new Usuario();

        usuario.setUsername(request.getUsername());
        usuario.setPassword(request.getPassword());
        usuario.setRol(request.getRol());

        return usuarioService.registrar(usuario);
    }

    // Login
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword())

        );

        Usuario usuario = usuarioRepository
                .findByUsername(request.getUsername())
                .orElseThrow();

        String token = jwtService.generarToken(usuario);

        return new AuthResponse(
                token,
                usuario.getUsername(),
                usuario.getRol().name());
    }

}
