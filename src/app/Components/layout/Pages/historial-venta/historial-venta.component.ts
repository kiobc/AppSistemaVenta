import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from'moment';

import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';

import { Venta } from '../../../../Interfaces/venta';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

formularioBusqueda: FormGroup ; 
opcionesBusqueda: any[] = [
  { value: 'fecha', label: 'Por fecha' },
  { value: 'numero', label: 'Numero de venta' }
]

columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento','tipoPago', 'total', 'accion'];
dataInicio: Venta[] = [];
  dataListaVentas = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private dialog: MatDialog,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ){
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
    fechaInicio:[''],
    fechaFin:['']
    });

    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value => {
      this.formularioBusqueda.patchValue({
        numero: '',
        fechaInicio: '',
        fechaFin: ''
      })
  });
  }
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataListaVentas.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaVentas.filter = filterValue.trim().toLowerCase();
  }

buscarVentas(){
  let _fechaInicio: string="";
  let _fechaFin: string="";

  if(this.formularioBusqueda.value.buscarPor === 'fecha'){
    _fechaInicio = (this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
    _fechaFin = (this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio==="Invalid date" || _fechaFin==="Invalid date"){
      this._utilidadService.mostrarAlerta('Debe ingresar ambas fechas.', 'Oops');
      return;
    }

    this._ventaService.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaVentas.data = data.value;
        } else {
          this._utilidadService.mostrarAlerta('No se encontraron datos', 'Oops');
        }
      },
      error: (e) => {
        console.error(e);
      }
    })
    
}

}

verDetalleVenta(_venta: Venta){

  this.dialog.open(ModalDetalleVentaComponent,{
    data: _venta,
    disableClose: true,
    width: '700px'
  })
}
}
