import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { DestinatariosComponent } from './pages/destinatarios/destinatarios.component';
import { TransferenciasComponent } from './pages/transferencias/transferencias.component';
import { MovimientosComponent } from './pages/movimientos/movimientos.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'destinatarios', component: DestinatariosComponent, canActivate: [AuthGuard] },
  { path: 'transferencias/:accountNumber', component: TransferenciasComponent, canActivate: [AuthGuard] },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
