import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto';
import { CategoriaService, Categoria } from '../../services/categoria';
import { CarritoService, CartItem, DatosClienteCheckout } from '../../services/carrito';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  public carritoService = inject(CarritoService);
  private router = inject(Router);

  // Lista completa y filtrada
  todosLosProductos: Producto[] = [];
  productosVisibles: Producto[] = [];
  categorias: Categoria[] = [];
  marcasDisponibles: string[] = [];

  // Carrito
  itemsCarrito: CartItem[] = [];
  mostrarModalCarrito = false;
  toastMensaje = '';
  procesandoCompra = false;
  pedidoExitoso: any = null;
  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 1;
  tallaSeleccionada: string = '';

  datosCliente: DatosClienteCheckout = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  // Estado UI
  loading = true;
  filtroActivo: string = 'todos';     // todos | hombre | mujer | marcas | ofertas
  marcaSeleccionada: string = '';
  tituloSeccion: string = 'Todos los Productos';
  mostrarDropdownMarcas = false;

  // ── BÚSQUEDA ──────────────────────────────────
  mostrarPanelBusqueda = false;
  textoBusqueda: string = '';
  resultadosBusqueda: Producto[] = [];

  // ── FAVORITOS ─────────────────────────────────
  mostrarPanelFavoritos = false;
  favoritos: Producto[] = [];
  toastFavMensaje = '';

  // ── CUENTA DE USUARIO ────────────────────────────────
  mostrarPanelCuenta = false;
  usuarioLogueado = false;
  datosUsuario = {
    nombre: '',
    email: '',
    rol: ''
  };

  // SVG genérico de respaldo
  readonly defaultImage: string =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="%23cccccc" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>';

  ngOnInit(): void {
    this.cargarTodo();
    this.verificarAutenticacion();
    this.carritoService.items$.subscribe(items => {
      this.itemsCarrito = items;
    });
    // Cargar favoritos del localStorage
    this.cargarFavoritosLocales();
  }

  verificarAutenticacion(): void {
    const token = localStorage.getItem('token');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const emailUsuario = localStorage.getItem('email');
    const rolUsuario = localStorage.getItem('role');

    if (token) {
      this.usuarioLogueado = true;
      this.datosUsuario.nombre = nombreUsuario || 'Usuario';
      this.datosUsuario.email = emailUsuario || '';
      this.datosUsuario.rol = rolUsuario || 'CLIENTE';
    } else {
      this.usuarioLogueado = false;
    }
  }

  cargarTodo(): void {
    this.loading = true;

    this.productoService.getProductos().subscribe({
      next: (prods) => {
        this.todosLosProductos = prods;
        this.productosVisibles = prods;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.loading = false;
      }
    });

    this.productoService.getMarcas().subscribe({
      next: (marcas) => { this.marcasDisponibles = marcas; },
      error: (err) => console.error('Error al obtener marcas:', err)
    });

    this.categoriaService.getCategorias().subscribe({
      next: (cats) => { this.categorias = cats; },
      error: (err) => console.error('Error al obtener categorías:', err)
    });
  }

  // ────────────────────────────────────
  // BÚSQUEDA
  // ────────────────────────────────────

  toggleBusqueda(): void {
    this.mostrarPanelBusqueda = !this.mostrarPanelBusqueda;
    if (this.mostrarPanelBusqueda) {
      this.mostrarPanelFavoritos = false;
      this.textoBusqueda = '';
      this.resultadosBusqueda = [];
      // Foco al input después de que aparezca
      setTimeout(() => {
        const input = document.getElementById('search-input') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  }

  buscarProductos(): void {
    const query = this.textoBusqueda.trim().toLowerCase();
    if (!query) {
      this.resultadosBusqueda = [];
      return;
    }
    this.resultadosBusqueda = this.todosLosProductos.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      (p.marca && p.marca.toLowerCase().includes(query)) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(query)) ||
      (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(query))
    );
  }

  seleccionarResultado(prod: Producto): void {
    this.cerrarBusqueda();
    this.abrirDetalle(prod);
  }

  cerrarBusqueda(): void {
    this.mostrarPanelBusqueda = false;
    this.textoBusqueda = '';
    this.resultadosBusqueda = [];
  }

  // ────────────────────────────────────
  // FAVORITOS
  // ────────────────────────────────────

  cargarFavoritosLocales(): void {
    try {
      const data = localStorage.getItem('favoritos_zapatillas');
      this.favoritos = data ? JSON.parse(data) : [];
    } catch {
      this.favoritos = [];
    }
  }

  guardarFavoritosLocales(): void {
    localStorage.setItem('favoritos_zapatillas', JSON.stringify(this.favoritos));
  }

  esFavorito(prod: Producto): boolean {
    return this.favoritos.some(f => f.id === prod.id);
  }

  toggleFavorito(prod: Producto, event?: Event): void {
    if (event) event.stopPropagation();
    if (this.esFavorito(prod)) {
      this.favoritos = this.favoritos.filter(f => f.id !== prod.id);
      this.mostrarToastFav(`💔 ${prod.nombre} eliminado de favoritos`);
    } else {
      this.favoritos = [...this.favoritos, prod];
      this.mostrarToastFav(`❤️ ${prod.nombre} agregado a favoritos`);
    }
    this.guardarFavoritosLocales();
  }

  toggleFavoritos(): void {
    this.mostrarPanelFavoritos = !this.mostrarPanelFavoritos;
    if (this.mostrarPanelFavoritos) {
      this.mostrarPanelBusqueda = false;
    }
  }

  cerrarFavoritos(): void {
    this.mostrarPanelFavoritos = false;
  }

  mostrarToastFav(mensaje: string): void {
    this.toastFavMensaje = mensaje;
    setTimeout(() => { this.toastFavMensaje = ''; }, 2500);
  }

  // ────────────────────────────────────
  // LÓGICA DE CARRITO Y COMPRA
  // ────────────────────────────────────

  agregarAlCarrito(prod: Producto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.carritoService.agregarProducto(prod);
    this.mostrarToast(`¡${prod.nombre} agregado al carrito! 🛍️`);
  }

  mostrarToast(mensaje: string): void {
    this.toastMensaje = mensaje;
    setTimeout(() => {
      this.toastMensaje = '';
    }, 2800);
  }

  abrirDetalle(prod: Producto): void {
    this.productoSeleccionado = prod;
    this.cantidadSeleccionada = 1;
    this.tallaSeleccionada = '';
  }

  obtenerOpcionesProducto(producto: Producto | null): string[] {
    if (!producto?.talla) return [];

    return producto.talla
      .split(',')
      .map(opcion => opcion.trim())
      .filter(Boolean);
  }

  obtenerPrecioOriginal(producto: Producto | null): number | null {
    if (!producto) return null;

    const porcentaje = producto.porcentajeDescuento ?? 0;
    if (!porcentaje || porcentaje <= 0) return null;

    return Number(((producto.precio * 100) / (100 - porcentaje)).toFixed(2));
  }

  cerrarDetalle(): void {
    this.productoSeleccionado = null;
  }

  incrementarCantidad(): void {
    if (this.productoSeleccionado && this.cantidadSeleccionada < this.productoSeleccionado.stock) {
      this.cantidadSeleccionada++;
    }
  }

  decrementarCantidad(): void {
    if (this.cantidadSeleccionada > 1) {
      this.cantidadSeleccionada--;
    }
  }

  agregarDetalleAlCarrito(): void {
    if (!this.productoSeleccionado) return;

    for (let i = 0; i < this.cantidadSeleccionada; i++) {
      this.carritoService.agregarProducto(this.productoSeleccionado);
    }

    this.mostrarToast(`¡Se agregaron ${this.cantidadSeleccionada} unidades al carrito! 🛍️`);
    this.cerrarDetalle();
  }

  togglePanelCuenta(): void {
    if (!this.usuarioLogueado) {
      // Si no está logueado, ir directo al login
      this.router.navigate(['/login']);
      return;
    }

    // Si está logueado, mostrar/ocultar el panel
    this.mostrarPanelCuenta = !this.mostrarPanelCuenta;
    if (this.mostrarPanelCuenta) {
      this.mostrarPanelBusqueda = false;
      this.mostrarPanelFavoritos = false;
    }
  }

  cerrarPanelCuenta(): void {
    this.mostrarPanelCuenta = false;
  }

  irAMiCuenta(): void {
    this.cerrarPanelCuenta();
    // Aquí puedes navegar a una página de perfil si la tienes
    // this.router.navigate(['/mi-cuenta']);
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('email');
    this.usuarioLogueado = false;
    this.mostrarPanelCuenta = false;
    this.router.navigate(['/login']);
  }

  toggleCarritoModal(): void {
    this.mostrarModalCarrito = !this.mostrarModalCarrito;
  }

  cerrarCarritoModal(): void {
    this.mostrarModalCarrito = false;
    this.pedidoExitoso = null;
  }

  incrementar(item: CartItem): void {
    this.carritoService.agregarProducto(item.producto);
  }

  decrementar(item: CartItem): void {
    if (item.producto.id) {
      this.carritoService.decrementarCantidad(item.producto.id);
    }
  }

  eliminarItem(item: CartItem): void {
    if (item.producto.id) {
      this.carritoService.eliminarProducto(item.producto.id);
    }
  }

  async confirmarCompra(): Promise<void> {
    if (!this.datosCliente.nombre || !this.datosCliente.email) {
      alert('Por favor ingrese al menos su Nombre y Email para registrar la compra.');
      return;
    }

    this.procesandoCompra = true;
    try {
      const res = await this.carritoService.procesarCompra(this.datosCliente);
      this.pedidoExitoso = res;
      this.datosCliente = { nombre: '', email: '', telefono: '', direccion: '' };
    } catch (err: any) {
      alert('Ocurrió un error al procesar el pedido: ' + (err.message || 'Intente nuevamente'));
    } finally {
      this.procesandoCompra = false;
    }
  }

  // ────────────────────────────────────
  // FILTROS DEL NAVBAR
  // ────────────────────────────────────

  filtrarHombre(): void {
    this.filtroActivo = 'hombre';
    this.tituloSeccion = 'Productos para Hombre';
    this.mostrarDropdownMarcas = false;
    this.loading = true;
    this.productoService.getProductosPorGenero('HOMBRE').subscribe({
      next: (prods) => { this.productosVisibles = prods; this.loading = false; },
      error: () => { this.productosVisibles = []; this.loading = false; }
    });
  }

  filtrarMujer(): void {
    this.filtroActivo = 'mujer';
    this.tituloSeccion = 'Productos para Mujer';
    this.mostrarDropdownMarcas = false;
    this.loading = true;
    this.productoService.getProductosPorGenero('MUJER').subscribe({
      next: (prods) => { this.productosVisibles = prods; this.loading = false; },
      error: () => { this.productosVisibles = []; this.loading = false; }
    });
  }

  mostrarMarcas(): void {
    this.filtroActivo = 'marcas';
    this.tituloSeccion = 'Explorar por Marca';
    this.mostrarDropdownMarcas = true;
    this.productosVisibles = this.todosLosProductos;
  }

  seleccionarMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    this.tituloSeccion = `Marca: ${marca}`;
    this.mostrarDropdownMarcas = false;
    this.loading = true;
    this.productoService.getProductosPorMarca(marca).subscribe({
      next: (prods) => { this.productosVisibles = prods; this.loading = false; },
      error: () => { this.productosVisibles = []; this.loading = false; }
    });
  }

  filtrarOfertas(): void {
    this.filtroActivo = 'ofertas';
    this.tituloSeccion = '🔥 Ofertas Especiales';
    this.mostrarDropdownMarcas = false;
    this.loading = true;
    this.productoService.getOfertas().subscribe({
      next: (prods) => { this.productosVisibles = prods; this.loading = false; },
      error: () => { this.productosVisibles = []; this.loading = false; }
    });
  }

  mostrarTodos(): void {
    this.filtroActivo = 'todos';
    this.tituloSeccion = 'Todos los Productos';
    this.mostrarDropdownMarcas = false;
    this.productosVisibles = this.todosLosProductos;
  }

  cerrarDropdown(): void {
    this.mostrarDropdownMarcas = false;
  }

  // Respaldo de imagen rota
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage;
  }

  @HostListener('document:keydown.escape')
  onEscKey(): void {
    this.cerrarBusqueda();
    this.cerrarFavoritos();
    this.cerrarDetalle();
    this.cerrarPanelCuenta();
  }
}