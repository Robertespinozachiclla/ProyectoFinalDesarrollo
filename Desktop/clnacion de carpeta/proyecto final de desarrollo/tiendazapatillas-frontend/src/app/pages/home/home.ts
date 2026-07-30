import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeBackendService, HomeResponse } from '../../services/home';
import { ProductoService, Producto } from '../../services/producto'; // 🟢 Agregamos ProductoService
import { Categoria } from '../../services/categoria';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeBackendService);
  private productoService = inject(ProductoService); // 🟢 Inyectamos servicio de productos

  destacados: Producto[] = [];
  categorias: Categoria[] = [];
  loading = true;

  ngOnInit(): void {
    this.cargarDatosHome();
  }

  cargarDatosHome(): void {
    // 1. Cargamos las categorías/datos generales desde HomeService
    this.homeService.getHomeData().subscribe({
      next: (data: HomeResponse) => {
        this.categorias = data.categorias;
        
        // 2. Cargamos TODOS los productos para asegurarnos de que lo nuevo aparezca
        this.cargarTodosLosProductos();
      },
      error: (err) => {
        console.error('Error al cargar datos del Home:', err);
        // Si falla el homeData, intentamos cargar los productos de todos modos
        this.cargarTodosLosProductos();
      }
    });
  }

  cargarTodosLosProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (prods: Producto[]) => {
        // Ordenamos o asignamos la lista completa de productos
        this.destacados = prods;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.loading = false;
      }
    });
  }
}