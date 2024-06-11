import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {}

  obtenerUsuarios() {
    this._usuarioService.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaUsuarios.data = data.value;
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
    this.obtenerUsuarios();
  }

  ngAfterViewInit() {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario() {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario: Usuario) {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar al usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta('El usuario fue eliminado', 'Éxito');
              this.obtenerUsuarios();
            } else {
              this._utilidadService.mostrarAlerta('No se pudo eliminar al usuario', 'Error');
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
