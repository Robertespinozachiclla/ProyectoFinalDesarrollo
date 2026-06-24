package epiis.unamba.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import epiis.unamba.Model.Pedido;
import epiis.unamba.Service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedService;

    public PedidoController(PedidoService pedService) {
        this.pedService = pedService;
    }

    @GetMapping
    public List<Pedido> listar() {
        return pedService.listar();
    }

    @GetMapping("/{id}")
    public Pedido obtenerPorId(@PathVariable Long id) {
        return pedService.obtenerPorId(id);
    }

    @PostMapping
    public Pedido guardar(@RequestBody Pedido pedido) {
        return pedService.guardar(pedido);
    }

    @PutMapping("/{id}")
    public Pedido actualizar(
            @PathVariable Long id,
            @RequestBody Pedido pedido) {
        return pedService.actualizar(id, pedido);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable Long id) {
        return pedService.eliminar(id);
    }
}