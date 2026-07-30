import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto';
import { CategoriaService, Categoria } from '../../services/categoria';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

  // Control de sección
  seccionActual: string = 'productos';

  // Datos globales
  productos: Producto[] = [];
  categorias: Categoria[] = [];

  // Filtros de búsqueda
  busquedaProducto: string = '';
  busquedaCategoria: string = '';

  // Estados UI
  loading = true;
  guardando = false;
  modoEdicion = false;
  idProductoEditar: number | null = null;

  mensajeExito = '';
  mensajeError = '';

  // Formulario Producto
  nuevoProducto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    marca: '',
    color: '',
    imagenUrl: '',
    categoria: undefined
  };
  categoriaSeleccionadaId: number | null = null;

  // Formulario Categoría
  nuevaCategoria: Categoria = {
    nombre: '',
    descripcion: ''
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActual = seccion;
    this.limpiarAlertas();
  }

  limpiarAlertas(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  cargarDatos(): void {
    this.loading = true;

    this.productoService.getProductos().subscribe({
      next: (prods: Producto[]) => {
        this.productos = prods;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar productos:', err);
        this.mensajeError = 'Error de conexión con el servidor.';
        this.loading = false;
      }
    });

    this.categoriaService.getCategorias().subscribe({
      next: (cats: Categoria[]) => {
        this.categorias = cats;
      },
      error: (err: any) => console.error('Error al cargar categorías:', err)
    });
  }

  // --- GETTERS PARA METRICAS Y FILTROS ---
  get productosFiltrados(): Producto[] {
    if (!this.busquedaProducto.trim()) return this.productos;
    const q = this.busquedaProducto.toLowerCase();
    return this.productos.filter(p => 
      p.nombre.toLowerCase().includes(q) || 
      (p.marca && p.marca.toLowerCase().includes(q))
    );
  }

  get productosStockBajoCount(): number {
    return this.productos.filter(p => p.stock <= 5).length;
  }

  get valorTotalInventario(): number {
    return this.productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  }

  // --- OPERACIONES DE PRODUCTOS ---
  guardarProducto(): void {
    this.limpiarAlertas();

    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio || !this.categoriaSeleccionadaId) {
      this.mensajeError = 'Por favor completa los campos obligatorios (*).';
      return;
    }

    this.guardando = true;
    this.nuevoProducto.categoria = { id: Number(this.categoriaSeleccionadaId), nombre: '' };

    if (this.modoEdicion && this.idProductoEditar) {
      // 🟢 CORRECCIÓN: Editar Producto existente usando PUT (actualizarProducto)
      this.nuevoProducto.id = this.idProductoEditar;
      this.productoService.actualizarProducto(this.idProductoEditar, this.nuevoProducto).subscribe({
        next: () => {
          this.mensajeExito = '¡Producto actualizado correctamente!';
          this.finalizarGuardado();
        },
        error: (err: any) => {
          console.error(err);
          this.mensajeError = 'Error al actualizar el producto.';
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo Producto usando POST (guardarProducto)
      this.productoService.guardarProducto(this.nuevoProducto).subscribe({
        next: () => {
          this.mensajeExito = '¡Producto registrado con éxito!';
          this.finalizarGuardado();
        },
        error: (err: any) => {
          console.error(err);
          this.mensajeError = 'Error al registrar el producto.';
          this.guardando = false;
        }
      });
    }
  }

  prepararEdicion(producto: Producto): void {
    this.limpiarAlertas();
    this.modoEdicion = true;
    this.idProductoEditar = producto.id || null;

    this.nuevoProducto = { ...producto };
    this.categoriaSeleccionadaId = producto.categoria ? producto.categoria.id : null;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.idProductoEditar = null;
    this.limpiarFormularioProducto();
  }

  eliminarProducto(id?: number): void {
    if (!id) return;
    this.limpiarAlertas();

    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.mensajeExito = 'Producto eliminado correctamente.';
          this.cargarDatos();
        },
        error: (err: any) => {
          console.error(err);
          this.mensajeError = 'No se pudo eliminar el producto.';
        }
      });
    }
  }

  private finalizarGuardado(): void {
    this.guardando = false;
    this.modoEdicion = false;
    this.idProductoEditar = null;
    this.limpiarFormularioProducto();
    this.cargarDatos();
  }

  limpiarFormularioProducto(): void {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      marca: '',
      color: '',
      imagenUrl: '',
      categoria: undefined
    };
    this.categoriaSeleccionadaId = null;
  }

  // --- OPERACIONES DE CATEGORÍAS ---
  crearCategoria(): void {
    this.limpiarAlertas();

    if (!this.nuevaCategoria.nombre.trim()) {
      this.mensajeError = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.guardando = true;
    this.categoriaService.guardarCategoria(this.nuevaCategoria).subscribe({
      next: () => {
        this.mensajeExito = `¡Categoría "${this.nuevaCategoria.nombre}" creada con éxito!`;
        this.nuevaCategoria = { nombre: '', descripcion: '' };
        this.guardando = false;
        this.cargarDatos();
      },
      error: (err: any) => {
        console.error(err);
        this.mensajeError = 'No se pudo guardar la categoría.';
        this.guardando = false;
      }
    });
  }
}