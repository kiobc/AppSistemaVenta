import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from '../../../../Interfaces/venta';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }],
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {
  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: 'fecha', label: 'Por fecha' },
    { value: 'numero', label: 'Número de venta' },
  ];
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  dataInicio: Venta[] = [];
  dataListaVentas = new MatTableDataSource<Venta>(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: [''],
    });

    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(() => {
      this.formularioBusqueda.patchValue({
        numero: '',
        fechaInicio: '',
        fechaFin: '',
      });
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataListaVentas.paginator = this.paginacionTabla;
  }

  buscarVentas(): void {
    const buscarPor = this.formularioBusqueda.value.buscarPor;

    if (buscarPor === 'fecha') {
      const fechaInicio = (this.formularioBusqueda.value.fechaInicio);
      const fechaFin = (this.formularioBusqueda.value.fechaFin);

      if (!fechaInicio.isValid() || !fechaFin.isValid()) {
        this._utilidadService.mostrarAlerta('Debe ingresar ambas fechas.', 'Oops');
        return;
      }

      this._ventaService.historial(buscarPor, '', fechaInicio.format('DD/MM/YYYY'), fechaFin.format('DD/MM/YYYY')).subscribe({
        next: (data) => {
          if (data.status) {
            this.dataListaVentas.data = data.value;
          } else {
            this._utilidadService.mostrarAlerta('No se encontraron datos', 'Oops');
          }
        },
        error: (e) => {
          console.error(e);
        },
      });
    } else if (buscarPor === 'numero') {
      const numeroVenta = this.formularioBusqueda.value.numero;

      if (!numeroVenta) {
        this._utilidadService.mostrarAlerta('Debe ingresar un número de venta', 'Oops');
        return;
      }

      this._ventaService.historial(buscarPor, numeroVenta, '', '').subscribe({
        next: (data) => {
          if (data.status) {
            this.dataListaVentas.data = data.value;
          } else {
            this._utilidadService.mostrarAlerta('No se encontraron datos', 'Oops');
          }
        },
        error: (e) => {
          console.error(e);
        },
      });
    }
  }

  verDetalleVenta(venta: Venta): void {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: venta,
      disableClose: true,
      width: '700px',
    });
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaVentas.filter = filterValue.trim().toLowerCase();
  }
}
