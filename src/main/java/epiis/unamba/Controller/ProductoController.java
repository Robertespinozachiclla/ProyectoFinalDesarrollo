package epiis.unamba.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epiis.unamba.model.Producto;
import epiis.unamba.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    private final ProductoService prodService;

    public ProductoController(ProductoService prodService) {
        this.prodService = prodService;
    }

    @GetMapping
    public List<Producto> listar() {
        return prodService.listar();
    }

    // 🔵 Filtrar por género (HOMBRE, MUJER, UNISEX)
    @GetMapping("/genero/{genero}")
    public List<Producto> listarPorGenero(@PathVariable String genero) {
        return prodService.listarPorGenero(genero);
    }

    // 🟠 Obtener lista de marcas únicas
    @GetMapping("/marcas")
    public List<String> listarMarcas() {
        return prodService.listarMarcas();
    }

    // 🟡 Filtrar productos por marca
    @GetMapping("/marca/{marca}")
    public List<Producto> listarPorMarca(@PathVariable String marca) {
        return prodService.listarPorMarca(marca);
    }

    // 🔴 Productos en oferta
    @GetMapping("/ofertas")
    public List<Producto> listarOfertas() {
        return prodService.listarOfertas();
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

    @PatchMapping("/{id}")
    public Producto actualizarParcial(
            @PathVariable Long id,
            @RequestBody Producto producto) {
        return prodService.actualizarParcial(id, producto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        try {
            boolean eliminado = prodService.eliminar(id);
            if (eliminado) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}