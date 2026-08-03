import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  marca?: string;
  color?: string;
  talla?: string;
  disciplina?: string;
  tipoAjuste?: string;
  material?: string;
  materialPlantilla?: string;
  porcentajeDescuento?: number;
  imagenUrl?: string;
  genero?: string;       // HOMBRE, MUJER, UNISEX
  esOferta?: boolean;
  categoria?: {
    id: number;
    nombre?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/productos`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 1. Obtener todos (Público)
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // 2. Filtrar por género
  getProductosPorGenero(genero: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/genero/${genero}`);
  }

  // 3. Obtener marcas únicas
  getMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/marcas`);
  }

  // 4. Filtrar por marca
  getProductosPorMarca(marca: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/marca/${marca}`);
  }

  // 5. Obtener ofertas
  getOfertas(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/ofertas`);
  }

  // 6. Crear producto (Requiere Token)
  guardarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto, {
      headers: this.getHeaders()
    });
  }

  // 7. Actualizar producto (Requiere Token)
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, {
      headers: this.getHeaders()
    });
  }

  // 8. Eliminar producto (Requiere Token)
  eliminarProducto(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}