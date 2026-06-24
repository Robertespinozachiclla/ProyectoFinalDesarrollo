package epiis.unamba.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import epiis.unamba.Model.Cliente;
import epiis.unamba.Repository.ClienteRepository;

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
