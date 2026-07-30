import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeBackendService, HomeResponse } from '../../services/home';
import { Producto } from '../../services/producto';
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

  destacados: Producto[] = [];
  categorias: Categoria[] = [];
  loading = true;

  ngOnInit(): void {
    this.cargarDatosHome();
  }

  cargarDatosHome(): void {
    this.homeService.getHomeData().subscribe({
      next: (data: HomeResponse) => {
        this.destacados = data.destacados;
        this.categorias = data.categorias;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del Home:', err);
        this.loading = false;
      }
    });
  }
}