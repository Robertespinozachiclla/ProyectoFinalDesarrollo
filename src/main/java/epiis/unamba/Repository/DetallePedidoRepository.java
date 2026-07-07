package epiis.unamba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.model.DetallePedido;

public interface DetallePedidoRepository 
	extends JpaRepository<DetallePedido, Long>{
}
