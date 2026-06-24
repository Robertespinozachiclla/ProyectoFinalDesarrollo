package epiis.unamba.Service;
import java.util.List;

import org.springframework.stereotype.Service;

import epiis.unamba.Model.Pedido;
import epiis.unamba.Repository.PedidoRepository;

@Service
public class PedidoService {
	private final PedidoRepository pedRepo;

	public PedidoService(PedidoRepository pedRepo) {
        this.pedRepo = pedRepo;
    }

    public List<Pedido> listar() {
        return pedRepo.findAll();
    }

    public Pedido obtenerPorId(Long id) {
        return pedRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    public Pedido guardar(Pedido pedido) {
        return pedRepo.save(pedido);
    }

    public Pedido actualizar(Long id, Pedido pedido) {
        Pedido existe = this.obtenerPorId(id);

        existe.setEstado(pedido.getEstado());
        existe.setTotal(pedido.getTotal());

        return pedRepo.save(existe);
    }

    public boolean eliminar(Long id) {
        Pedido existe = this.obtenerPorId(id);
        pedRepo.delete(existe);
        return true;
    }
}
