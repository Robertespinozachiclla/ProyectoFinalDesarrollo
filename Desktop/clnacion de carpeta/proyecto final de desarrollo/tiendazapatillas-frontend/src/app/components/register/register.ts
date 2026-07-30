import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // 🟢 Inicializamos todos los campos de tu base de datos
  nuevoUsuario: RegisterRequest = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    rol: 'CLIENTE'
  };

  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  onRegister(): void {
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.password || !this.nuevoUsuario.correo) {
      this.mensajeError = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.authService.register(this.nuevoUsuario).subscribe({
      next: (res: any) => {
        this.cargando = false;
        this.mensajeExito = '¡Cuenta creada con éxito! Redirigiendo al login...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error en el registro:', err);
        this.mensajeError = 'No se pudo crear la cuenta. Verifica que los datos sean correctos.';
      }
    });
  }
}