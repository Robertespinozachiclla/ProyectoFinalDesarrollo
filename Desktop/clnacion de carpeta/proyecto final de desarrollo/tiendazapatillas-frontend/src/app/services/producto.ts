import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  categoria?: Categoria;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http=inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/productos`;

  getProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(this.apiUrl);
  }

  guardarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  eliminarProducto(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
