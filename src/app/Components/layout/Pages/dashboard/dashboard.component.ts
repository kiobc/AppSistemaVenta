import { Component, OnInit } from '@angular/core';

import {Chart, registerables} from 'chart.js';
import { DashboardService } from '../../../../Services/dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalIngresos:string = '0';
  totalVentas:string = '0';
  totalProductos:string = '0';
  constructor(
    private _dashboardService: DashboardService
  ) { }

  mostrarGrafico(labelGrafico:any[], dataGrafico:any[]) {
    const chartBarras=new Chart('graficoBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y:{
            beginAtZero: true
          }
        }
      }
    });

  }
  ngOnInit(): void {
    this._dashboardService.resumen().subscribe({
      next: (data) => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;
        
          const arrayData:any[] = data.value.ventasUltimaSemana;
          console.log(arrayData);

          const labelTemp= arrayData.map((value)=> value.fecha);
          const dataTemp= arrayData.map((value)=> value.total);
          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: (e) => {
        console.error(e);
      }
    })
  }

}
