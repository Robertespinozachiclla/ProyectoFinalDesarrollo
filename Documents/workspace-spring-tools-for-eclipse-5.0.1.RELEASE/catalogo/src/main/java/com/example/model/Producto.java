package com.example.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import ch.qos.logback.core.rolling.helper.IntegerTokenConverter;
import jakarta.persistence.*;

@Entity
@Table(name="Producto")
public class Producto {
 
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	private Long id;
	@Column(nullable=false, length=150)
	private String nombre;
	@Column(nullable=false)
	private Double precio;
	@Column(nullable=false)
	private Integer stock;
	@ManyToOne
	@JoinColumn(name="categoria_id",nullable=false)
	private Categoria categoria;
	
	@CreationTimestamp
	@Column(name="created_at", updatable =false)
	private LocalDateTime createAt;
	
	@UpdateTimestamp
	@Column (name="updated_at")
	private LocalDateTime updatedAt;
	
	public Producto () {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Double getPrecio() {
		return precio;
	}

	public void setPrecio(Double precio) {
		this.precio = precio;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public LocalDateTime getCreateAt() {
		return createAt;
	}

	public void setCreateAt(LocalDateTime createAt) {
		this.createAt = createAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	
}
