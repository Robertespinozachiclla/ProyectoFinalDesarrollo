package epiis.unamba.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;

@Entity
@Table(name="producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=100)
    private String nombre;

    @Column(length=255)
    private String descripcion;

    @Column(nullable=false)
    private Double precio;

    @Column(nullable=false)
    private Integer stock;

    @Column(length=100)
    private String marca;

    @Column(length=50)
    private String color;

    @Column(length=50)
    private String talla;

    @Column(length=100)
    private String disciplina;

    @Column(name="tipo_ajuste", length=100)
    private String tipoAjuste;

    @Column(length=100)
    private String material;

    @Column(name="material_plantilla", length=100)
    private String materialPlantilla;

    @Column(name="porcentaje_descuento")
    private Integer porcentajeDescuento = 0;

    @Lob
    @Column(name = "imagen_url", columnDefinition = "LONGTEXT")
    private String imagenUrl;

    @Column(length = 10)
    private String genero; // HOMBRE, MUJER, UNISEX

    @Column(name = "es_oferta")
    private Boolean esOferta = false;

    @ManyToOne
    @JoinColumn(name="categoria_id", nullable=true)
    private Categoria categoria;

    @CreationTimestamp
    @Column(name="created_at", updatable=false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;
	

    public Producto() {}

    // ==========================================
    // GETTERS Y SETTERS
    // ==========================================

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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    // 👟 Getter y Setter agregados para "talla"
    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public String getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(String disciplina) {
        this.disciplina = disciplina;
    }

    public String getTipoAjuste() {
        return tipoAjuste;
    }

    public void setTipoAjuste(String tipoAjuste) {
        this.tipoAjuste = tipoAjuste;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getMaterialPlantilla() {
        return materialPlantilla;
    }

    public void setMaterialPlantilla(String materialPlantilla) {
        this.materialPlantilla = materialPlantilla;
    }

    public Integer getPorcentajeDescuento() {
        return porcentajeDescuento;
    }

    public void setPorcentajeDescuento(Integer porcentajeDescuento) {
        this.porcentajeDescuento = porcentajeDescuento;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Boolean getEsOferta() {
        return esOferta;
    }

    public void setEsOferta(Boolean esOferta) {
        this.esOferta = esOferta;
    }
}