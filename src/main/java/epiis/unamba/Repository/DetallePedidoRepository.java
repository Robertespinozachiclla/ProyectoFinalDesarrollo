package epiis.unamba.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.Model.DetallePedido;

public interface DetallePedidoRepository 
	extends JpaRepository<DetallePedido, Long>{
}
