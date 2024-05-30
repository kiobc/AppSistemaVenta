import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component'; 
import { SharedModule } from '../../Reutilizable/shared/shared.module';

const routes: Routes = [
  { path: '', component: LayoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes),SharedModule],
  exports: [RouterModule]
})
export class LayoutModule { }
