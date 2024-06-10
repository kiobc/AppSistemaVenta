import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from '../../../../Interfaces/rol';
import { Usuario } from '../../../../Interfaces/usuario';
import { RolService } from '../../../../Services/rol.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import{UtilidadService} from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usurio',
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})
export class ModalUsuarioComponent implements OnInit  {
 
  formularioUsario: FormGroup;
  ocultarPassword:boolean = true;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";
  listaRoles:Rol[] = [];

  constructor( 
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
  @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
  private fb: FormBuilder,
  private rolService:RolService,
  private usuarioService:UsuarioService,
  private utilidadService:UtilidadService
  ) {
    this.formularioUsario = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required], 
      esActivo: ['1', Validators.required]
    });

    if(this.datosUsuario !=null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
     this.rolService.lista().subscribe({
      next:(data)=>{
        if(data.status) this.listaRoles = data.value;
      },
      error:(e)=>{}
     })
   }
  ngOnInit(): void {
    if(this.datosUsuario!=null){
      this.formularioUsario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      })
      
    }
  }

  guardarEditar_Usuario(){
  const usuario:Usuario={
    idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
    nombreCompleto: this.formularioUsario.value.nombreCompleto,
    correo: this.formularioUsario.value.correo,
    idRol: this.formularioUsario.value.idRol,
    rolDescripcion: "",
    clave: this.formularioUsario.value.clave,
    esActivo: parseInt(this.formularioUsario.value.esActivo),
    nombre: ''
  }
  if(this.datosUsuario!=null){
    this.usuarioService.guardar(usuario).subscribe({
      next:(data)=>{
        if(data.status){
          this.utilidadService.mostrarAlerta("El usuario fue registrado con éxito","Éxito");
          this.modalActual.close("true");
        }else
          this.utilidadService.mostrarAlerta("No se pudo crear al usuario","Error");
        
      },
      error:(e)=>{}
    })
  }else{
    this.usuarioService.editar(usuario).subscribe({
      next:(data)=>{
        if(data.status){
          this.utilidadService.mostrarAlerta("El usuario fue editado","Éxito");
          this.modalActual.close("true");
        }else
          this.utilidadService.mostrarAlerta("No se pudo editar al usuario","Error");
        
      },
      error:(e)=>{}
    })
  }
}
}
