import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup,Validators}  from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from '../../../../Services/producto.service';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

import { Producto } from '../../../../Interfaces/producto';
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = "EFECTIVO";
  totalPagar: number = 0;

  formularioProductoVenta:FormGroup;
  columnaTabla: string[] = ['producto', 'cantidad', 'precio', 'total','accion'];
  datosDetalleVenta= new MatTableDataSource(this.listaProductosParaVenta);

  retornarProductoPorFiltro(busqueda:any):Producto[] {
    const valorBuscado=typeof busqueda ==='string'? busqueda.toLowerCase() : busqueda.nombre.toLowerCase();
    return this.listaProductosFiltro.filter(item=>item.nombre.toLowerCase().indexOf(valorBuscado));
  }

  constructor(
    private fb:FormBuilder,
    private _productoService:ProductoService,
    private _ventaService:VentaService,
    private _utilidadService:UtilidadService
  ){
    this.formularioProductoVenta=this.fb.group({
      producto:['',Validators.required],
      cantidad:['',Validators.required]
    });

    this._productoService.lista().subscribe({
      next: (data) => {
        if (data.status) {
         const lista = data.value as Producto[];
         this.listaProductos=lista.filter(p=>p.esActivo==1&& p.stock>0);
        } 
      },
      error: (e) => {
      }
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value=>{
this.listaProductosFiltro=this.retornarProductoPorFiltro(value);
  })
  }
  ngOnInit(): void {
      
  }
  mostrarProducto(producto:Producto):string{
    return producto.nombre;
  }

  productoParaVenta(event:any){
    this.productoSeleccionado=event.option.value;
  }

  agregarProductoParaVenta(){
    const _cantidad:number=this.formularioProductoVenta.value.cantidad;
    const _precio:number=parseInt(this.productoSeleccionado.precio);
    const _total:number=_cantidad*_precio;
    this.totalPagar=this.totalPagar+_total;


    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: _precio.toFixed(2),
      totalTexto: _total.toFixed(2)
    });
this.datosDetalleVenta= new MatTableDataSource(this.listaProductosParaVenta);
this.formularioProductoVenta.patchValue({
  producto:'',
  cantidad:''
});
  }

 
}
