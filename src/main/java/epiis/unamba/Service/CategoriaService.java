package epiis.unamba.service;

import java.util.List;

import org.springframework.stereotype.Service;

import epiis.unamba.repository.CategoriaRepository;
import epiis.unamba.model.Categoria;

@Service
public class CategoriaService {

    private final CategoriaRepository catRepo;

    public CategoriaService(CategoriaRepository catRepo) {
        this.catRepo = catRepo;
    }

    public List<Categoria> listar() {
        return catRepo.findAll();
    }

    public Categoria obtenerPorId(Long id) {
        return catRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
    }

    public Categoria guardar(Categoria cat) {
        return catRepo.save(cat);
    }

    public Categoria actualizar(Long id, Categoria cat) {
        Categoria existe = this.obtenerPorId(id);
        existe.setNombre(cat.getNombre());
        existe.setDescripcion(cat.getDescripcion());
        return catRepo.save(existe);
    }

    public Categoria actualizarParcial(Long id, Categoria cat) {
        Categoria existe = this.obtenerPorId(id);
        if (cat.getNombre() != null) {
            existe.setNombre(cat.getNombre());
        }
        if (cat.getDescripcion() != null) {
            existe.setDescripcion(cat.getDescripcion());
        }
        return catRepo.save(existe);
    }

    public boolean eliminar(Long id) {
        Categoria existe = this.obtenerPorId(id);
        catRepo.delete(existe);
        return true;
    }
}