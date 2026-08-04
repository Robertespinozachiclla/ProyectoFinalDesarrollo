package epiis.unamba.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import epiis.unamba.DTO.AuthResponse;
import epiis.unamba.DTO.LoginRequest;
import epiis.unamba.DTO.RegisterRequest;
import epiis.unamba.model.Cliente;
import epiis.unamba.model.Rol;
import epiis.unamba.model.Usuario;
import epiis.unamba.repository.ClienteRepository;
import epiis.unamba.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final ClienteRepository clienteRepository;
    private final ClienteService clienteService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UsuarioRepository usuarioRepository,
            UsuarioService usuarioService,
            ClienteRepository clienteRepository,
            ClienteService clienteService,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {

        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
        this.clienteRepository = clienteRepository;
        this.clienteService = clienteService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // Registrar usuario
    public Usuario registrar(RegisterRequest request) {

        Usuario usuario = new Usuario();

        usuario.setUsername(request.getUsername());
        usuario.setPassword(request.getPassword());
        usuario.setRol(request.getRol() != null ? request.getRol() : Rol.CLIENTE);

        Usuario usuarioGuardado = usuarioService.registrar(usuario);

        if (request.getNombre() != null || request.getCorreo() != null) {
            Cliente cliente = new Cliente();
            cliente.setNombre(request.getNombre() != null ? request.getNombre() : usuarioGuardado.getUsername());
            cliente.setApellido(request.getApellido() != null ? request.getApellido() : "");
            cliente.setCorreo(request.getCorreo() != null ? request.getCorreo() : usuarioGuardado.getUsername());
            cliente.setTelefono(request.getTelefono());
            cliente.setDireccion(request.getDireccion());
            clienteService.guardar(cliente);
        }

        return usuarioGuardado;
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

        // 🟢 Buscar el cliente asociado por el correo (que es el username)
        Cliente cliente = clienteRepository.findByCorreo(usuario.getUsername()).orElse(null);

        return new AuthResponse(
                token,
                usuario.getUsername(),
                usuario.getRol().name(),
                // 🟢 Devolver nombre, email, telefono y direccion si el cliente existe
                cliente != null ? cliente.getNombre() : usuario.getUsername(),
                cliente != null ? cliente.getCorreo() : usuario.getUsername(),
                cliente != null ? cliente.getTelefono() : "",
                cliente != null ? cliente.getDireccion() : "");
    }

}