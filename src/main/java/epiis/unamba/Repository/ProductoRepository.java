package epiis.unamba.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import epiis.unamba.model.*;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByGeneroIgnoreCase(String genero);

    @Query("SELECT p FROM Producto p WHERE LOWER(p.genero) = LOWER(:genero) OR LOWER(p.categoria.genero) = LOWER(:genero)")
    List<Producto> findByGeneroOrCategoriaGenero(@Param("genero") String genero);

    List<Producto> findByMarcaIgnoreCase(String marca);
    List<Producto> findByEsOfertaTrue();
}

