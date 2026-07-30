package epiis.unamba.service;

import java.util.List;

import org.springframework.stereotype.Service;
import epiis.unamba.model.Producto;
import epiis.unamba.repository.ProductoRepository;

@Service
public class ProductoService {
    private final ProductoRepository prodRepo;
    
    public ProductoService(ProductoRepository prodRepo) {
        this.prodRepo = prodRepo;
    }
    
    public List<Producto> listar(){
        return prodRepo.findAll();
    }
    
    public Producto obtenerPorId(Long id) {
        return prodRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
    
    public Producto guardar(Producto prod) {
        return prodRepo.save(prod);
    }
    
    public Producto actualizar(Long id, Producto prod) {
        Producto existe = this.obtenerPorId(id);
        existe.setNombre(prod.getNombre());
        existe.setDescripcion(prod.getDescripcion());
        existe.setPrecio(prod.getPrecio());
        existe.setStock(prod.getStock());
        existe.setMarca(prod.getMarca());
        existe.setColor(prod.getColor());
        
        // 👟 NUEVO: Actualización de talla
        existe.setTalla(prod.getTalla());
        
        return prodRepo.save(existe);
    }

    public Producto actualizarParcial(Long id, Producto prod) {
        Producto existe = this.obtenerPorId(id);
        if (prod.getNombre() != null)
            existe.setNombre(prod.getNombre());
        if (prod.getDescripcion() != null)
            existe.setDescripcion(prod.getDescripcion());
        if (prod.getPrecio() != null)
            existe.setPrecio(prod.getPrecio());
        if (prod.getStock() != null)
            existe.setStock(prod.getStock());
        if (prod.getMarca() != null)
            existe.setMarca(prod.getMarca());
        if (prod.getColor() != null)
            existe.setColor(prod.getColor());
            
        // 👟 NUEVO: Actualización parcial de talla
        if (prod.getTalla() != null)
            existe.setTalla(prod.getTalla());
            
        return prodRepo.save(existe);
    }

    public boolean eliminar(Long id) {
        Producto existe = this.obtenerPorId(id);
        prodRepo.delete(existe);
        return true;
    }
}