package epiis.unamba.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.Model.*;

public interface ProductoRepository extends JpaRepository<Producto, Long>{
}
