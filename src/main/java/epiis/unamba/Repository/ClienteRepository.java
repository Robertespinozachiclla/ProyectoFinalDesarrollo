package epiis.unamba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.model.Cliente;

public interface ClienteRepository 
	extends JpaRepository<Cliente, Long>{
}