import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// ==========================================
// INTERFACES DEL MODELO DE DATOS
// ==========================================
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
  imagenUrl?: string;
  categoria?: Categoria | null;
}

export interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export interface Pedido {
  id?: number;
  fecha?: string;
  total: number;
  estado: string;
  cliente?: Cliente;
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

  // Endpoints del Backend Spring Boot
  private readonly API_PRODUCTOS = 'http://localhost:8080/api/productos';
  private readonly API_CATEGORIAS = 'http://localhost:8080/api/categorias';
  private readonly API_PEDIDOS = 'http://localhost:8080/api/pedidos';
  private readonly API_CLIENTES = 'http://localhost:8080/api/clientes';

  seccionActiva: string = 'dashboard';
  filtroGeneral: string = '';

  // Colecciones de Datos
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];

  // Formularios
  nuevoProducto: Producto = this.obtenerProductoVacio();
  editandoProducto: boolean = false;
  productoIdEditar: number | null = null;

  nuevaCategoria: Categoria = { nombre: '', descripcion: '' };
  editandoCategoria: boolean = false;
  categoriaIdEditar: number | null = null;

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarPedidos();
    this.cargarClientes();
  }

  /**
   * Genera las cabeceras HTTP necesarias incluyendo el JWT guardado.
   */
  private obtenerHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  irASeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  // ==========================================
  // LÓGICA DE PRODUCTOS
  // ==========================================
  cargarProductos(): void {
    this.http.get<Producto[]>(this.API_PRODUCTOS, this.obtenerHeaders()).subscribe({
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
      this.http.put<Producto>(`${this.API_PRODUCTOS}/${this.productoIdEditar}`, this.nuevoProducto, this.obtenerHeaders()).subscribe({
        next: () => {
          this.limpiarFormularioProducto();
          this.cargarProductos();
        },
        error: (err) => console.error('Error al actualizar producto:', err)
      });
    } else {
      this.http.post<Producto>(this.API_PRODUCTOS, this.nuevoProducto, this.obtenerHeaders()).subscribe({
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
      imagenUrl: prod.imagenUrl || '',
      categoria: prod.categoria ? { id: prod.categoria.id, nombre: prod.categoria.nombre } : null
    };
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Desea eliminar este producto de forma permanente?')) {
      this.http.delete(`${this.API_PRODUCTOS}/${id}`, this.obtenerHeaders()).subscribe({
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
    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      marca: '',
      color: '',
      talla: '',
      imagenUrl: '',
      categoria: null
    };
  }

  // ==========================================
  // LÓGICA DE CATEGORÍAS
  // ==========================================
  cargarCategorias(): void {
    this.http.get<Categoria[]>(this.API_CATEGORIAS, this.obtenerHeaders()).subscribe({
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
      this.http.put<Categoria>(`${this.API_CATEGORIAS}/${this.categoriaIdEditar}`, this.nuevaCategoria, this.obtenerHeaders()).subscribe({
        next: () => {
          this.limpiarFormularioCategoria();
          this.cargarCategorias();
        },
        error: (err) => console.error('Error al actualizar categoría:', err)
      });
    } else {
      this.http.post<Categoria>(this.API_CATEGORIAS, this.nuevaCategoria, this.obtenerHeaders()).subscribe({
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
      this.http.delete(`${this.API_CATEGORIAS}/${id}`, this.obtenerHeaders()).subscribe({
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
  // LÓGICA DE PEDIDOS Y CLIENTES
  // ==========================================
  cargarPedidos(): void {
    this.http.get<Pedido[]>(this.API_PEDIDOS, this.obtenerHeaders()).subscribe({
      next: (data) => (this.pedidos = data),
      error: (err) => console.error('Error al cargar pedidos:', err)
    });
  }

  cargarClientes(): void {
    this.http.get<Cliente[]>(this.API_CLIENTES, this.obtenerHeaders()).subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  // ==========================================
  // AUXILIARES Y NAVEGACIÓN
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