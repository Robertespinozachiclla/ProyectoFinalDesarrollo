package epiis.unamba.service;

import java.util.List;

import org.springframework.stereotype.Service;

import epiis.unamba.model.Cliente;
import epiis.unamba.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository cliRepo;

    public ClienteService(ClienteRepository cliRepo) {
        this.cliRepo = cliRepo;
    }

    public List<Cliente> listar() {
        return cliRepo.findAll();
    }

    public Cliente obtenerPorId(Long id) {
        return cliRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public Cliente guardar(Cliente cli) {
        if (cli.getApellido() == null) {
            cli.setApellido("");
        }
        java.util.Optional<Cliente> existente = cliRepo.findByCorreo(cli.getCorreo());
        if (existente.isPresent()) {
            Cliente cliente = existente.get();
            cliente.setNombre(cli.getNombre() != null ? cli.getNombre() : cliente.getNombre());
            if (cli.getApellido() != null && !cli.getApellido().isEmpty()) {
                cliente.setApellido(cli.getApellido());
            }
            cliente.setTelefono(cli.getTelefono() != null ? cli.getTelefono() : cliente.getTelefono());
            cliente.setDireccion(cli.getDireccion() != null ? cli.getDireccion() : cliente.getDireccion());
            return cliRepo.save(cliente);
        }
        return cliRepo.save(cli);
    }

    public Cliente actualizar(Long id, Cliente cli) {
        Cliente existe = this.obtenerPorId(id);

        existe.setNombre(cli.getNombre());
        existe.setApellido(cli.getApellido());
        existe.setCorreo(cli.getCorreo());
        existe.setTelefono(cli.getTelefono());	
        existe.setDireccion(cli.getDireccion());

        return cliRepo.save(existe);
    }

    public boolean eliminar(Long id) {
        Cliente existe = this.obtenerPorId(id);
        cliRepo.delete(existe);
        return true;
    }
}
