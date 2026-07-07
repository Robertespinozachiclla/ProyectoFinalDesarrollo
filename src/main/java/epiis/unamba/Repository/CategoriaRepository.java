package epiis.unamba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.model.Categoria;

public interface CategoriaRepository 
	extends JpaRepository<Categoria, Long>{

}
