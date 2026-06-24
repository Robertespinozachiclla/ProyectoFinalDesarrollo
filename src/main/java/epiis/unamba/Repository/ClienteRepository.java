package epiis.unamba.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.Model.Cliente;

public interface ClienteRepository 
	extends JpaRepository<Cliente, Long>{
}