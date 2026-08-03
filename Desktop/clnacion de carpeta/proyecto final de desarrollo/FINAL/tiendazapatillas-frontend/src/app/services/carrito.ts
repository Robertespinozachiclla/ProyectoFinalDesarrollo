import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Producto } from './producto';
import { environment } from '../../environments/environment';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export interface DatosClienteCheckout {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private http = inject(HttpClient);
  private apiPedidos = `${environment.baseUrl}/pedidos`;
  private apiDetalles = `${environment.baseUrl}/detalle-pedidos`;
  private apiClientes = `${environment.baseUrl}/clientes`;

  private itemsSubject = new BehaviorSubject<CartItem[]>(this.cargarCarrito());
  public items$ = this.itemsSubject.asObservable();

  private cargarCarrito(): CartItem[] {
    const saved = localStorage.getItem('carrito_zapatillas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  }

  private guardarCarrito(items: CartItem[]): void {
    localStorage.setItem('carrito_zapatillas', JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  obtenerItems(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  agregarProducto(producto: Producto): void {
    const items = [...this.obtenerItems()];
    const index = items.findIndex(i => i.producto.id === producto.id);

    if (index > -1) {
      items[index].cantidad += 1;
    } else {
      items.push({ producto, cantidad: 1 });
    }

    this.guardarCarrito(items);
  }

  decrementarCantidad(productoId: number): void {
    let items = [...this.obtenerItems()];
    const index = items.findIndex(i => i.producto.id === productoId);

    if (index > -1) {
      if (items[index].cantidad > 1) {
        items[index].cantidad -= 1;
      } else {
        items = items.filter(i => i.producto.id !== productoId);
      }
      this.guardarCarrito(items);
    }
  }

  eliminarProducto(productoId: number): void {
    const items = this.obtenerItems().filter(i => i.producto.id !== productoId);
    this.guardarCarrito(items);
  }

  vaciarCarrito(): void {
    this.guardarCarrito([]);
  }

  obtenerTotal(): number {
    return this.obtenerItems().reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  obtenerCantidadTotal(): number {
    return this.obtenerItems().reduce((sum, item) => sum + item.cantidad, 0);
  }

  // 🚀 Proceso completo de Compra
  async procesarCompra(clienteData: DatosClienteCheckout): Promise<any> {
    const items = this.obtenerItems();
    if (items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const total = this.obtenerTotal();

    // 1. Guardar o crear Cliente
    let clienteGuardado: any = null;
    try {
      clienteGuardado = await firstValueFrom(
        this.http.post<any>(this.apiClientes, {
          nombre: clienteData.nombre,
          email: clienteData.email,
          telefono: clienteData.telefono || '',
          direccion: clienteData.direccion || ''
        })
      );
    } catch (e) {
      console.warn('No se pudo crear cliente en backend, continuando pedido general');
    }

    // 2. Guardar Pedido
    const nuevoPedido = {
      total: total,
      estado: 'PENDIENTE',
      cliente: clienteGuardado ? { id: clienteGuardado.id } : null
    };

    const pedidoCreado = await firstValueFrom(
      this.http.post<any>(this.apiPedidos, nuevoPedido)
    );

    // 3. Guardar DetallePedido por cada ítem
    for (const item of items) {
      const detalle = {
        cantidad: item.cantidad,
        precio: item.producto.precio,
        subtotal: item.producto.precio * item.cantidad,
        pedido: { id: pedidoCreado.id },
        producto: { id: item.producto.id }
      };

      await firstValueFrom(
        this.http.post<any>(this.apiDetalles, detalle)
      );
    }

    // 4. Vaciar carrito al completar
    this.vaciarCarrito();

    return pedidoCreado;
  }
}
