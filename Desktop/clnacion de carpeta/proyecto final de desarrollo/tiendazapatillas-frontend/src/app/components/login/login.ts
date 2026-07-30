import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credenciales: LoginRequest = {
    username: '',
    password: ''
  };

  cargando = false;
  mensajeError = '';

  onLogin(): void {
  if (!this.credenciales.username || !this.credenciales.password) {
    this.mensajeError = 'Por favor completa todos los campos.';
    return;
  }

  this.cargando = true;
  this.mensajeError = '';

  this.authService.login(this.credenciales).subscribe({
    next: (res: any) => {
      this.cargando = false;

      // 🟢 VALIDACIÓN 1: Verificar si el backend envió un token/rol válido
      if (!res || !res.token) {
        this.mensajeError = 'Usuario o contraseña incorrectos.';
        return;
      }

      // Si todo está bien, redirige según el rol
      const rolObtenido = (res.rol || res.role || '').toUpperCase();
      if (rolObtenido === 'ADMIN' || rolObtenido === 'ROLE_ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err: any) => {
      this.cargando = false;
      console.error('Error de autenticación:', err);

      // 🟢 Agregamos err.status === 403
      if (err.status === 401 || err.status === 400 || err.status === 403) {
        this.mensajeError = 'Usuario o contraseña incorrectos.';
      } else {
        this.mensajeError = 'Error al conectar con el servidor. Intenta más tarde.';
      }
    }
  });
}
}
