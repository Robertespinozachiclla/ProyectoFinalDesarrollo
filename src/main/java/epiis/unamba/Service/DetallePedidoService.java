package epiis.unamba.service;
import java.util.List;

import org.springframework.stereotype.Service;

import epiis.unamba.model.DetallePedido;
import epiis.unamba.model.Producto;
import epiis.unamba.repository.DetallePedidoRepository;
import epiis.unamba.repository.ProductoRepository;

@Service
public class DetallePedidoService {
	
	private final DetallePedidoRepository detRepo;
    private final ProductoRepository prodRepo;

    public DetallePedidoService(DetallePedidoRepository detRepo, ProductoRepository prodRepo) {
        this.detRepo = detRepo;
        this.prodRepo = prodRepo;
    }

    public List<DetallePedido> listar() {
        return detRepo.findAll();
    }

    public DetallePedido obtenerPorId(Long id) {
        return detRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));
    }

    public DetallePedido guardar(DetallePedido detalle) {

    Producto producto = prodRepo.findById(detalle.getProducto().getId())
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    System.out.println("Producto: " + producto.getNombre());
    System.out.println("Precio: " + producto.getPrecio());

    detalle.setProducto(producto);
    detalle.setPrecio(producto.getPrecio());
    detalle.setSubtotal(producto.getPrecio() * detalle.getCantidad());

    System.out.println("Precio detalle: " + detalle.getPrecio());
    System.out.println("Subtotal: " + detalle.getSubtotal());

    return detRepo.save(detalle);

}

    public DetallePedido actualizar(Long id, DetallePedido detalle) {

    DetallePedido existe = obtenerPorId(id);

    Producto producto = prodRepo.findById(detalle.getProducto().getId())
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    existe.setProducto(producto);
    existe.setCantidad(detalle.getCantidad());
    existe.setPrecio(producto.getPrecio());
    existe.setSubtotal(producto.getPrecio() * detalle.getCantidad());

    return detRepo.save(existe);
}

    public boolean eliminar(Long id) {
        DetallePedido existe = this.obtenerPorId(id);
        detRepo.delete(existe);
        return true;
    }
}