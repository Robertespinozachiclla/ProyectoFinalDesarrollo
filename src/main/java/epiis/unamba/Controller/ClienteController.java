package epiis.unamba.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import epiis.unamba.Model.Cliente;
import epiis.unamba.Service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService cliService;

    public ClienteController(ClienteService cliService) {
        this.cliService = cliService;
    }

    @GetMapping
    public List<Cliente> listar() {
        return cliService.listar();
    }

    @GetMapping("/{id}")
    public Cliente obtenerPorId(@PathVariable Long id) {
        return cliService.obtenerPorId(id);
    }

    @PostMapping
    public Cliente guardar(@RequestBody Cliente cliente) {
        return cliService.guardar(cliente);
    }

    @PutMapping("/{id}")
    public Cliente actualizar(
            @PathVariable Long id,
            @RequestBody Cliente cliente) {
        return cliService.actualizar(id, cliente);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable Long id) {
        return cliService.eliminar(id);
    }
}