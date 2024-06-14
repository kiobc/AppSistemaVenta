import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit,AfterViewInit {
  columnasTabla: string[] = ['nombre', 'categoria', 'stock','precio', 'estado', 'acciones'];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService
  ){}

    obtenerProductos() {
      this._productoService.lista().subscribe({
        next: (data) => {
          if (data.status) {
            this.dataListaProductos.data = data.value;
          } else {
            this._utilidadService.mostrarAlerta('No se encontraron datos', 'Oops');
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
    }

  

  ngOnInit(): void {
      this.obtenerProductos();
  }

  ngAfterViewInit() {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto() {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerProductos();
    });
  }

  editarProducto(usuario: Producto) {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerProductos();
    });
  }

  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar el producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productoService.eliminar(producto.idCategoria).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta('El producto fue eliminado', 'Éxito');
              this.obtenerProductos();
            } else {
              this._utilidadService.mostrarAlerta('No se pudo eliminar el producto', 'Error');
            }
          },
          error: (e) => {
            console.error(e);
          }
        });
      }
    });
  }
}
