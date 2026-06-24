package epiis.unamba.Service;
import java.util.List;

import org.springframework.stereotype.Service;

import epiis.unamba.Model.DetallePedido;
import epiis.unamba.Repository.DetallePedidoRepository;

@Service
public class DetallePedidoService {
	
	private final DetallePedidoRepository detRepo;

	public DetallePedidoService(DetallePedidoRepository detRepo) {
        this.detRepo = detRepo;
    }

    public List<DetallePedido> listar() {
        return detRepo.findAll();
    }

    public DetallePedido obtenerPorId(Long id) {
        return detRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));
    }

    public DetallePedido guardar(DetallePedido detalle) {
        return detRepo.save(detalle);
    }

    public DetallePedido actualizar(Long id, DetallePedido detalle) {

        DetallePedido existe = this.obtenerPorId(id);

        existe.setCantidad(detalle.getCantidad());
        existe.setPrecio(detalle.getPrecio());
        existe.setSubtotal(detalle.getSubtotal());

        return detRepo.save(existe);
    }

    public boolean eliminar(Long id) {
        DetallePedido existe = this.obtenerPorId(id);
        detRepo.delete(existe);
        return true;
    }
}