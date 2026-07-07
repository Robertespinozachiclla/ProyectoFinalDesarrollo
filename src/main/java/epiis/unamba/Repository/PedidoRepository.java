package epiis.unamba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.model.Pedido;

public interface PedidoRepository 
	extends JpaRepository<Pedido, Long>{

}