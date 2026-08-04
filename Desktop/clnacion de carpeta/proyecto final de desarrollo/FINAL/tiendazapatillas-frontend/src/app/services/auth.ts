import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// 1. Modelos e Interfases DTO
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol?: string;
}

export interface AuthResponse {
  token?: string;
  rol?: string;
  role?: string;
  username?: string;
  nombreUsuario?: string;
  email?: string;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // 🟢 Ajusta esta URL según el puerto de tu Backend Spring Boot
  private apiUrl = 'http://localhost:8080/api/auth'; 

  /**
   * Método para Iniciar Sesión (Login)
   */
  login(credenciales: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res) => {
        // Almacena el token y el rol de forma inmediata en el navegador
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        
        // Guarda el rol sin importar si el backend responde con 'rol' o 'role'
        const userRol = res.rol || res.role;
        if (userRol) {
          localStorage.setItem('role', userRol.toUpperCase());
        }

        // 🟢 Guarda el nombre y el email del usuario
        if (res.nombreUsuario) {
          localStorage.setItem('nombreUsuario', res.nombreUsuario);
        }
        if (res.email) {
          localStorage.setItem('email', res.email);
        }
      })
    );
  }

  /**
   * Método para Registrar un Nuevo Usuario (Cliente)
   */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /**
   * Método para Cerrar Sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  /**
   * Métodos Auxiliares de Verificación
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}