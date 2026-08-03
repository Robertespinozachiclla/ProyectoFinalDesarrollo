import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from './producto';
import { Categoria } from './categoria';

export interface HomeResponse {
  destacados: Producto[];
  masVendidos: Producto[];
  categorias: Categoria[];
}

@Injectable({
  providedIn: 'root'
})
export class HomeBackendService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/public`;

  // Obtiene los datos del Home de un solo golpe
  getHomeData(): Observable<HomeResponse> {
    return this.http.get<HomeResponse>(`${this.apiUrl}/home`);
  }

  // Buscar productos por nombre o marca
  buscarProductos(query: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/buscar?q=${query}`);
  }

  // Filtrar productos por categoría
  getProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/categoria/${categoriaId}`);
  }
}