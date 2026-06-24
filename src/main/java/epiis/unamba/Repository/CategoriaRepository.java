package epiis.unamba.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.Model.Categoria;

public interface CategoriaRepository 
	extends JpaRepository<Categoria, Long>{

}
