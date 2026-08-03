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
  genero?: string; // HOMBRE, MUJER, UNISEX, TODOS
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
  genero?: string;       // HOMBRE, MUJER, UNISEX
  esOferta?: boolean;
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

  nuevaCategoria: Categoria = { nombre: '', descripcion: '', genero: 'TODOS' };
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

  /**
   * Método que se ejecuta al seleccionar la imagen desde los archivos locales
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageData = e.target?.result as string;
        if (!imageData) {
          alert('No se pudo leer el archivo de imagen. Intenta con otra imagen.');
          return;
        }

        const img = new Image();
        img.src = imageData;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleFactor = MAX_WIDTH / img.width;

          if (scaleFactor < 1) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleFactor;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            alert('No se pudo procesar la imagen en el navegador.');
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageType = file.type && (file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/jpeg')
            ? file.type
            : 'image/png';

          this.nuevoProducto.imagenUrl = canvas.toDataURL(imageType, 0.9);
        };

        img.onerror = () => {
          alert('No se pudo cargar la imagen seleccionada. Intenta con otro archivo.');
        };
      };

      reader.readAsDataURL(file);
    }
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
      genero: prod.genero || 'HOMBRE',
      esOferta: prod.esOferta || false,
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

    const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
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
      genero: 'HOMBRE',
      esOferta: false,
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
    this.nuevaCategoria = { nombre: cat.nombre, descripcion: cat.descripcion || '', genero: cat.genero || 'TODOS' };
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
    this.nuevaCategoria = { nombre: '', descripcion: '', genero: 'TODOS' };
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

  get placeholderSvg100(): string {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23cccccc" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>';
  }

  get placeholderSvg50(): string {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="%23cccccc" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>';
  }
}