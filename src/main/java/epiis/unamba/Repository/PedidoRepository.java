package epiis.unamba.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import epiis.unamba.Model.Pedido;

public interface PedidoRepository 
	extends JpaRepository<Pedido, Long>{

}