package com.example.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Repository.ProductoRepository;
import com.example.model.Producto;
import java.util.List;
@Service
public class ProductoService {

	@Autowired
	private ProductoRepository prodRepo;
	
	public List<Producto>listar(){
		return prodRepo.findAll();
	}
	
	
	public Producto obtenerPorId(Long id) {
		return prodRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("Producto no existe"));
	}
	public Producto guardar (Producto prod) {
		this.validarprecio(prod);
		return prodRepo.save(prod);
}
	
	public Producto actualizar(Long id,Producto prod) {
		Producto existe= this.obtenerPorId(id);

		this.validarprecio(prod);
		existe.setNombre(prod.getNombre());
		existe.setPrecio(prod.getPrecio());
		existe.setStock(prod.getStock());
		existe.setCategoria(prod.getCategoria());
		return prodRepo.save(existe);
	}
	
	public Producto actualizarParcial(Long id,Producto prod) {
		Producto existe =this.obtenerPorId(id);
		this.validarprecio(prod);
		if(prod.getNombre() != null)
			existe.setNombre(prod.getNombre());
		if(prod.getPrecio() !=null)
			existe.setPrecio(prod.getPrecio());
		if(prod.getStock() !=null)
			existe.setStock(prod.getStock());
		if(prod.getCategoria() !=null)
			existe.setCategoria(prod.getCategoria());
		
		return prodRepo.save(existe);
	}
	
	private boolean eliminar (Long id) {
		Producto existe =this.obtenerPorId(id);
		prodRepo.delete(existe);
		return true;
	}
	
	private void validarprecio (Producto prod) {
		if(prod.getPrecio() !=null && prod.getPrecio()<0) {
			throw new
			IllegalArgumentException("el precio no puede ser cero");
	}
	}
	
	
}
