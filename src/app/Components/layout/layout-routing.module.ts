import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'historial-venta', component: HistorialVentaComponent },
  { path: 'producto', component: ProductoComponent },
  { path: 'venta', component: VentaComponent },
  { path: 'reporte', component: ReporteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
