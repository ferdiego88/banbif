import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard-hipotecario',
  templateUrl: './dashboard-hipotecario.component.html',
  styleUrls: ['./dashboard-hipotecario.component.scss'],
})
export class DashboardHipotecarioComponent implements OnInit {
  showSubItems = false;
  hipotecarioForm = this.fb.group({
    MesId: [null],
    ZonaId: [null],
    OficinaId: [null],
    Fecha_Creacion_Desde: [null],
    Fecha_Creacion_Hasta: [null],
    Fecha_Estado_Desde: [null],
    Fecha_Estado_Hasta: [null],
    Vendedor: [null],
    Canal: [null],
    Origen: [null],
    Indicador: [null],
    Responsable: [null],
    Semaforo: [null],
    Variacion: [null],
    Tipo_ProductoId: [null],
    Sub_ProductoId: [null],
    EstadoId: [null],
  });
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }
     
  expand(){
    alert('Expande las tablas');
    this.showSubItems = true;
     }
}
