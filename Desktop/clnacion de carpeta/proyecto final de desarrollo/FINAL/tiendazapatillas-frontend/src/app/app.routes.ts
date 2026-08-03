import { Routes } from '@angular/router';

// Pages
import { HomeComponent } from './pages/home/home';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';

// Components
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

// Guards
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // 🟢 Debe estar AQUÍ, antes de '**'
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [adminGuard] 
  },
  { path: '**', redirectTo: 'home' } // ⚠️ Esta SIEMPRE debe ir al final de todas
];