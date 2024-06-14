
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from '../../../../Interfaces/categoria';
import { Producto } from '../../../../Interfaces/producto';
import { CategoriaService } from '../../../../Services/categoria.service';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css'
})
export class ModalProductoComponent implements OnInit  {

  formularioProducto : FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaService: CategoriaService,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService
  ){
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });
    if (this.datosProducto != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }


    if(this.datosProducto != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._categoriaService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
  ngOnInit(): void {
    if(this.datosProducto !=null){
this.formularioProducto.patchValue({
  nombre: this.datosProducto.nombre,
  idCategoria: this.datosProducto.idCategoria,
  stock: this.datosProducto.stock,
  precio: this.datosProducto.precio,
  esActivo: this.datosProducto.esActivo.toString()
});
    };
  }
  
  guardarEditar_Producto() {
    if (this.formularioProducto.invalid) {
      this._utilidadService.mostrarAlerta('Por favor complete los campos requeridos.', 'Error');
      return;
    }

    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo),
    };

    if (this.datosProducto == null) {
      this._productoService.guardar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("El producto fue registrado con éxito", "Éxito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo registra el producto", "Error");
          }
        },
        error: (e) => {
          console.error(e);
          this._utilidadService.mostrarAlerta('Ocurrió un error al intentar crear el usuario', 'Error');
        }
      });
    } else {
      this._productoService.editar(_producto).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);  // Añadir log para depuración
          if (data.status) {
            this._utilidadService.mostrarAlerta("El producto fue editado con éxito", "Éxito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo editar el producto", "Error");
          }
        },
        error: (e) => {
        }
      });
    }
  }

}
