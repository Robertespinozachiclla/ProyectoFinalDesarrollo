import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // 🟢 Excluir peticiones de login/registro o cuando no hay token válido
  if (req.url.includes('/api/auth/') || !token || token === 'undefined' || token === 'null') {
    return next(req);
  }

  // Si hay un token real y es una ruta privada, lo adjuntamos
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(authReq);
};