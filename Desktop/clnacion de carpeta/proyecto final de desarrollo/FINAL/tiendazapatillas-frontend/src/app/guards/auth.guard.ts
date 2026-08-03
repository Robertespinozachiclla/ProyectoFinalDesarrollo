import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 🟢 Si tiene token Y su rol es 'ADMIN' exactamente
  if (token && (role === 'ADMIN' || role === 'ROLE_ADMIN')) {
    return true;
  }

  // Si es un 'CLIENTE' o no está logueado, lo bloquea y lo manda al Home o Login
  router.navigate(['/home']);
  return false;
};