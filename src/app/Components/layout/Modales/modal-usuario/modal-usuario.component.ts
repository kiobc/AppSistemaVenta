import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from '../../../../Interfaces/rol';
import { Usuario } from '../../../../Interfaces/usuario';
import { RolService } from '../../../../Services/rol.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.datosUsuario != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      });
    }

    this._rolService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaRoles = data.value;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  guardarEditar_Usuario() {
    const usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
      nombre: ''
    };

    if (this.datosUsuario == null) {
      this._usuarioService.guardar(usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("El usuario fue registrado con éxito", "Éxito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo crear al usuario", "Error");
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
    } else {
      this._usuarioService.editar(usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("El usuario fue editado con éxito", "Éxito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo editar al usuario", "Error");
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }
}
