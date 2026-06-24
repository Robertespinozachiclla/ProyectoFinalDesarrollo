package epiis.unamba.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import epiis.unamba.Model.Producto;
import epiis.unamba.Service.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService prodService;

    public ProductoController(ProductoService prodService) {
        this.prodService = prodService;
    }

    @GetMapping
    public List<Producto> listar() {
        return prodService.listar();
    }

    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Long id) {
        return prodService.obtenerPorId(id);
    }

    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return prodService.guardar(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(
            @PathVariable Long id,
            @RequestBody Producto producto) {
        return prodService.actualizar(id, producto);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable Long id) {
        return prodService.eliminar(id);
    }
}