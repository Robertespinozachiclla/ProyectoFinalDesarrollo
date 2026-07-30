import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from './categoria';
import { environment } from '../../environments/environment';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  marca?: string;
  color?: string;
  imagenUrl?: string;
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
    const token = localStorage.getItem('token'); // Revisa que en el login lo guardes exactamente como 'token'
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 1. Obtener todos (Público)
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // 2. Crear producto (Requiere Token)
  guardarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto, { 
      headers: this.getHeaders() 
    });
  }

  // 3. Actualizar producto (Requiere Token) 👈 AGREGADO
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, { 
      headers: this.getHeaders() 
    });
  }

  // 4. Eliminar producto (Requiere Token)
  eliminarProducto(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(), 
      responseType: 'text' 
    });
  }
}