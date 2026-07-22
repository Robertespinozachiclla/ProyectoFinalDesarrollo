import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'admin',component:AdminDashboardComponent},
  { path: '**', redirectTo: '' }  
];
