import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {}
