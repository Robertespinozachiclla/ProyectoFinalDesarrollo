package epiis.unamba.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import epiis.unamba.Model.DetallePedido;
import epiis.unamba.Service.DetallePedidoService;

@RestController
@RequestMapping("/api/detalle-pedidos")
public class DetallePedidoController {

    private final DetallePedidoService detService;

    public DetallePedidoController(DetallePedidoService detService) {
        this.detService = detService;
    }

    @GetMapping
    public List<DetallePedido> listar() {
        return detService.listar();
    }

    @GetMapping("/{id}")
    public DetallePedido obtenerPorId(@PathVariable Long id) {
        return detService.obtenerPorId(id);
    }

    @PostMapping
    public DetallePedido guardar(@RequestBody DetallePedido detalle) {
        return detService.guardar(detalle);
    }

    @PutMapping("/{id}")
    public DetallePedido actualizar(
            @PathVariable Long id,
            @RequestBody DetallePedido detalle) {
        return detService.actualizar(id, detalle);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable Long id) {
        return detService.eliminar(id);
    }
}