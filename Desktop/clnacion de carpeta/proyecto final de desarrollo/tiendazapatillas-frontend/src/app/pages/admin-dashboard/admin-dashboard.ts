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

  // 🔴 CONTROL DE SECCIÓN ACTIVA: 'productos' | 'categorias' | 'pedidos' | 'clientes'
  seccionActual: string = 'productos';

  // Datos
  productos: Producto[] = [];
  categorias: Categoria[] = [];

  // Estados
  loading = true;
  guardando = false;
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
    categoria: undefined
  };
  categoriaSeleccionadaId: number | null = null;

  // Formulario Nueva Categoría
  nuevaCategoria: Categoria = {
    nombre: '',
    descripcion: ''
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Cambia la pestaña activa y limpia alertas
  cambiarSeccion(seccion: string): void {
    this.seccionActual = seccion;
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
        console.error('Error productos:', err);
        this.loading = false;
      }
    });

    this.categoriaService.getCategorias().subscribe({
      next: (cats: Categoria[]) => {
        this.categorias = cats;
      },
      error: (err: any) => console.error('Error categorías:', err)
    });
  }

  crearProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio || !this.categoriaSeleccionadaId) {
      this.mensajeError = 'Por favor completa los campos obligatorios (*).';
      return;
    }

    this.guardando = true;
    this.nuevoProducto.categoria = { id: Number(this.categoriaSeleccionadaId), nombre: '' };

    this.productoService.guardarProducto(this.nuevoProducto).subscribe({
      next: () => {
        this.mensajeExito = '¡Producto registrado con éxito!';
        this.guardando = false;
        this.limpiarFormularioProducto();
        this.cargarDatos();
      },
      error: (err: any) => {
        this.mensajeError = 'Error al registrar el producto.';
        this.guardando = false;
      }
    });
  }

  // Método para guardar una nueva Categoría (Si tu CategoriaService lo soporta)
  crearCategoria(): void {
    if (!this.nuevaCategoria.nombre) {
      this.mensajeError = 'El nombre de la categoría es obligatorio.';
      return;
    }
    // Aquí puedes invocar categoriaService.guardarCategoria() cuando implementes el POST en el backend
    this.mensajeExito = `Categoría "${this.nuevaCategoria.nombre}" lista para enviar.`;
    this.nuevaCategoria = { nombre: '', descripcion: '' };
  }

  eliminarProducto(id?: number): void {
    if (!id) return;
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.mensajeExito = 'Producto eliminado con éxito.';
          this.cargarDatos();
        }
      });
    }
  }

  limpiarFormularioProducto(): void {
    this.nuevoProducto = { nombre: '', descripcion: '', precio: 0, stock: 0, marca: '', color: '', categoria: undefined };
    this.categoriaSeleccionadaId = null;
  }
}