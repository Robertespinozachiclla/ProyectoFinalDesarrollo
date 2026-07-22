package com.example.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.model.Categoria;
import com.example.Repository.CategoriaRepository;

@Service
public class CategoriaService {
	
	@Autowired
	private CategoriaRepository catRepo;
	public List<Categoria>listar(){
		return catRepo.findAll();
	}
	
	public Categoria obtenerPorId(Long id) {
		return	catRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("categoria no encontrada"));
	}
	
	public Categoria guardar(Categoria cat){
	    return catRepo.save(cat);
	}
	/*actualizacion total*/
	public Categoria actualizar(Long id,Categoria cat) {
		Categoria existe=this.obtenerPorId(id);
		existe.setNombre(cat .getNombre());
		existe.setDescripcion(cat.getDescripcion());
		return catRepo.save(existe);
	}
	
	public Categoria actualizarParcial(Long id,Categoria cat) {
		Categoria existe=this.obtenerPorId(id);
		
		if(cat.getNombre()!=null)
		if(!existe.getNombre().equals(cat.getNombre()))
			existe.setNombre(cat.getNombre());
		
		if(cat.getDescripcion()!=null)
		if(!existe.getDescripcion().equals(cat.getDescripcion()))
			existe.setDescripcion(cat.getDescripcion());
		return catRepo.save(existe);
	}
	
	
	public boolean eliminar(Long id) {
		//validar reclas de negocio y retornar false si no cumple
		
		Categoria existe=this.obtenerPorId(id);
		catRepo.delete(existe);
		return true;
	}
}