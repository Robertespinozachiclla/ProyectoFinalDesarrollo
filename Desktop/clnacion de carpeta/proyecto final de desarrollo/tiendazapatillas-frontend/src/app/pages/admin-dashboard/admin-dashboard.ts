import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  marca?: string;
  color?: string;
  talla?: string;
  imagenUrl?: string; // 👟 Campo Talla
  categoria?: Categoria | null;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_PRODUCTOS = 'http://localhost:8080/api/productos';
  private readonly API_CATEGORIAS = 'http://localhost:8080/api/categorias';

  seccionActiva: string = 'dashboard';
  filtroGeneral: string = '';

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  nuevoProducto: Producto = this.obtenerProductoVacio();
  editandoProducto: boolean = false;
  productoIdEditar: number | null = null;

  nuevaCategoria: Categoria = { nombre: '', descripcion: '' };
  editandoCategoria: boolean = false;
  categoriaIdEditar: number | null = null;

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  irASeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  // ==========================================
  // LÓGICA DE PRODUCTOS
  // ==========================================
  cargarProductos(): void {
    this.http.get<Producto[]>(this.API_PRODUCTOS).subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  guardarProducto(): void {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) {
      alert('Por favor ingrese un nombre y precio válido.');
      return;
    }

    if (this.editandoProducto && this.productoIdEditar) {
      this.http.put<Producto>(`${this.API_PRODUCTOS}/${this.productoIdEditar}`, this.nuevoProducto).subscribe({
        next: () => {
          this.limpiarFormularioProducto();
          this.cargarProductos();
        },
        error: (err) => console.error('Error al actualizar producto:', err)
      });
    } else {
      this.http.post<Producto>(this.API_PRODUCTOS, this.nuevoProducto).subscribe({
        next: () => {
          this.limpiarFormularioProducto();
          this.cargarProductos();
        },
        error: (err) => console.error('Error al guardar producto:', err)
      });
    }
  }

  seleccionarProductoParaEditar(prod: Producto): void {
    this.editandoProducto = true;
    this.productoIdEditar = prod.id!;
    this.nuevoProducto = {
      nombre: prod.nombre,
      descripcion: prod.descripcion || '',
      precio: prod.precio,
      stock: prod.stock,
      marca: prod.marca || '',
      color: prod.color || '',
      talla: prod.talla || '',
      categoria: prod.categoria ? { id: prod.categoria.id, nombre: prod.categoria.nombre } : null
    };
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Eliminar producto de forma permanente?')) {
      this.http.delete(`${this.API_PRODUCTOS}/${id}`).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error('Error al eliminar producto:', err)
      });
    }
  }

  limpiarFormularioProducto(): void {
    this.nuevoProducto = this.obtenerProductoVacio();
    this.editandoProducto = false;
    this.productoIdEditar = null;
  }

  private obtenerProductoVacio(): Producto {
    return { nombre: '', descripcion: '', precio: 0, stock: 0, marca: '', color: '', talla: '', categoria: null };
  }

  // ==========================================
  // LÓGICA DE CATEGORÍAS
  // ==========================================
  cargarCategorias(): void {
    this.http.get<Categoria[]>(this.API_CATEGORIAS).subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  guardarCategoria(): void {
    if (!this.nuevaCategoria.nombre.trim()) {
      alert('Ingrese un nombre para la categoría.');
      return;
    }

    if (this.editandoCategoria && this.categoriaIdEditar) {
      this.http.put<Categoria>(`${this.API_CATEGORIAS}/${this.categoriaIdEditar}`, this.nuevaCategoria).subscribe({
        next: () => {
          this.limpiarFormularioCategoria();
          this.cargarCategorias();
        },
        error: (err) => console.error('Error al actualizar categoría:', err)
      });
    } else {
      this.http.post<Categoria>(this.API_CATEGORIAS, this.nuevaCategoria).subscribe({
        next: () => {
          this.limpiarFormularioCategoria();
          this.cargarCategorias();
        },
        error: (err) => console.error('Error al guardar categoría:', err)
      });
    }
  }

  seleccionarCategoriaParaEditar(cat: Categoria): void {
    this.editandoCategoria = true;
    this.categoriaIdEditar = cat.id!;
    this.nuevaCategoria = { nombre: cat.nombre, descripcion: cat.descripcion || '' };
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Desea eliminar esta categoría?')) {
      this.http.delete(`${this.API_CATEGORIAS}/${id}`).subscribe({
        next: () => this.cargarCategorias(),
        error: (err) => console.error('Error al eliminar categoría:', err)
      });
    }
  }

  limpiarFormularioCategoria(): void {
    this.nuevaCategoria = { nombre: '', descripcion: '' };
    this.editandoCategoria = false;
    this.categoriaIdEditar = null;
  }

  // ==========================================
  // AUXILIARES
  // ==========================================
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  compararCategorias(c1: Categoria, c2: Categoria): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}