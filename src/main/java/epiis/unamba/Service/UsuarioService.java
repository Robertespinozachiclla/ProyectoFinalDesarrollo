package epiis.unamba.Service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import epiis.unamba.Model.Usuario;
import epiis.unamba.Repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));
    }

    public Usuario obtenerPorUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));
    }

    public boolean existeUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    public Usuario registrar(Usuario usuario) {

        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("El usuario ya existe");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario usuario) {

        Usuario existe = obtenerPorId(id);

        existe.setUsername(usuario.getUsername());

        if (usuario.getPassword() != null &&
            !usuario.getPassword().isBlank()) {

            existe.setPassword(
                    passwordEncoder.encode(usuario.getPassword()));
        }

        existe.setRol(usuario.getRol());

        return usuarioRepository.save(existe);
    }

    public boolean eliminar(Long id) {

        Usuario usuario = obtenerPorId(id);

        usuarioRepository.delete(usuario);

        return true;
    }

}
