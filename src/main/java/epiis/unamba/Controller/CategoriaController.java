package epiis.unamba.Controller;

import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epiis.unamba.Model.Categoria;
import epiis.unamba.Service.CategoriaService;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService catService;

    public CategoriaController(CategoriaService catService) {
        this.catService = catService;
    }

    @GetMapping
    public List<Categoria> listar() {
        return catService.listar();
    }

    @GetMapping("/{id}")
    public Categoria obtenerPorId(@PathVariable Long id) {
        return catService.obtenerPorId(id);
    }

    @PostMapping
    public Categoria guardar(@RequestBody Categoria categoria) {
        return catService.guardar(categoria);
    }

    @PutMapping("/{id}")
    public Categoria actualizar(
            @PathVariable Long id,
            @RequestBody Categoria categoria) {
        return catService.actualizar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        try {
            boolean eliminado = catService.eliminar(id);
            if (eliminado) {
                return ResponseEntity.ok("Producto eliminado correctamente");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body("Producto no encontrado");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(e.getMessage());
        }
    }
}