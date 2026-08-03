package epiis.unamba.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;

import epiis.unamba.DTO.RegisterRequest;
import epiis.unamba.model.Cliente;
import epiis.unamba.model.Rol;
import epiis.unamba.model.Usuario;
import epiis.unamba.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registrarDebeCrearClienteCuandoLleganDatosDelRegistro() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("juan");
        request.setPassword("123456");
        request.setNombre("Juan");
        request.setApellido("Pérez");
        request.setCorreo("juan@test.com");
        request.setTelefono("987654321");
        request.setDireccion("Lima");
        request.setRol(Rol.CLIENTE);

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setUsername("juan");
        usuarioGuardado.setRol(Rol.CLIENTE);
        when(usuarioService.registrar(any(Usuario.class))).thenReturn(usuarioGuardado);

        authService.registrar(request);

        ArgumentCaptor<Cliente> clienteCaptor = ArgumentCaptor.forClass(Cliente.class);
        verify(clienteService).guardar(clienteCaptor.capture());

        Cliente cliente = clienteCaptor.getValue();
        assert cliente.getNombre().equals("Juan");
        assert cliente.getApellido().equals("Pérez");
        assert cliente.getCorreo().equals("juan@test.com");
        assert cliente.getTelefono().equals("987654321");
        assert cliente.getDireccion().equals("Lima");
    }
}
