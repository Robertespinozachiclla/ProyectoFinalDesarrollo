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
    
    // Guardamos token y rol
    localStorage.setItem('token', res.token);
    const rol = (res.rol || res.role || '').toUpperCase();
    localStorage.setItem('role', rol);
    if (res.nombreUsuario) {
      localStorage.setItem('nombreUsuario', res.nombreUsuario);
    }
    if (res.email) {
      localStorage.setItem('email', res.email);
    }
    if (res.telefono) {
      localStorage.setItem('telefono', res.telefono);
    }
    if (res.direccion) {
      localStorage.setItem('direccion', res.direccion);
    }

    // 🟢 REDIRECCIÓN SEGÚN EL ROL
    if (rol === 'ADMIN' || rol === 'ROLE_ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/home']); // 👈 El CLIENTE se va a Home
    }
  },
  error: (err) => {
    this.cargando = false;
    this.mensajeError = 'Usuario o contraseña incorrectos.';
  }
});
}
}
