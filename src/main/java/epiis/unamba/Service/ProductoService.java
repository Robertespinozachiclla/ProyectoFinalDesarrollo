package epiis.unamba.service;

import java.util.List;
import java.util.stream.Collectors;

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

    public List<Producto> listarPorGenero(String genero) {
        return prodRepo.findByGeneroOrCategoriaGenero(genero);
    }

    public List<Producto> listarOfertas() {
        return prodRepo.findByEsOfertaTrue();
    }

    public List<String> listarMarcas() {
        return prodRepo.findAll().stream()
                .map(Producto::getMarca)
                .filter(m -> m != null && !m.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<Producto> listarPorMarca(String marca) {
        return prodRepo.findByMarcaIgnoreCase(marca);
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
        existe.setTalla(prod.getTalla());
        existe.setDisciplina(prod.getDisciplina());
        existe.setTipoAjuste(prod.getTipoAjuste());
        existe.setMaterial(prod.getMaterial());
        existe.setMaterialPlantilla(prod.getMaterialPlantilla());
        existe.setPorcentajeDescuento(prod.getPorcentajeDescuento() != null ? prod.getPorcentajeDescuento() : 0);

        // ✅ Imagen
        if (prod.getImagenUrl() != null) {
            existe.setImagenUrl(prod.getImagenUrl());
        }

        // ✅ Categoría
        if (prod.getCategoria() != null) {
            existe.setCategoria(prod.getCategoria());
        }

        // ✅ Género y Oferta
        existe.setGenero(prod.getGenero());
        existe.setEsOferta(prod.getEsOferta() != null ? prod.getEsOferta() : false);
        
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
        if (prod.getTalla() != null)
            existe.setTalla(prod.getTalla());
        if (prod.getDisciplina() != null)
            existe.setDisciplina(prod.getDisciplina());
        if (prod.getTipoAjuste() != null)
            existe.setTipoAjuste(prod.getTipoAjuste());
        if (prod.getMaterial() != null)
            existe.setMaterial(prod.getMaterial());
        if (prod.getMaterialPlantilla() != null)
            existe.setMaterialPlantilla(prod.getMaterialPlantilla());
        if (prod.getPorcentajeDescuento() != null)
            existe.setPorcentajeDescuento(prod.getPorcentajeDescuento());
        if (prod.getImagenUrl() != null)
            existe.setImagenUrl(prod.getImagenUrl());
        if (prod.getCategoria() != null)
            existe.setCategoria(prod.getCategoria());
        if (prod.getGenero() != null)
            existe.setGenero(prod.getGenero());
        if (prod.getEsOferta() != null)
            existe.setEsOferta(prod.getEsOferta());
            
        return prodRepo.save(existe);
    }

    public boolean eliminar(Long id) {
        Producto existe = this.obtenerPorId(id);
        prodRepo.delete(existe);
        return true;
    }
}
