package com.example.Repository;
import com.example.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository 
	extends JpaRepository<Categoria, Long> {

}

