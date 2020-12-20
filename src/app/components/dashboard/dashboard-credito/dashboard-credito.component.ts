import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SolicitudCreditoHipotecario, TipoProductoModel, ZonaModel, EstadoModel, DashboardModel } from 'src/app/shared/models/fisics';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';
import { GeneralListService } from 'src/app/shared/services/general-list.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes.service';
import { Variables } from 'src/app/shared/variables';
// import {default as _rollupMoment} from 'moment';
import * as _moment from 'moment';
const moment = _moment;
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY'
  }
};


@Component({
  selector: 'app-dashboard-credito',
  templateUrl: './dashboard-credito.component.html',
  styleUrls: ['./dashboard-credito.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DashboardCreditoComponent extends FormularioBase implements OnInit {

  zonaModelList: ZonaModel [];
  oficinaList: TipoProductoModel [];
  estadoList: EstadoModel [];
  dashboard: DashboardModel [];
  tipoProductoList: TipoProductoModel [];
  estadoCreaExpedienteList: SolicitudCreditoHipotecario [];
  solicitudHipotecarioList: SolicitudCreditoHipotecario [];
  flujoSeguimientoList: SolicitudCreditoHipotecario [];
  totalExpedientes = 0;
  totalTiempoPromedioEstacion = 0;
  totalTiempoPromedioTotal = 0;
  totalMonto = 0;
  dashboardForm = this.fb.group({
    ZonaId : [null],
    OficinaId : [null],
    Fecha_Creacion_Desde : [null],
    Fecha_Creacion_Hasta : [null],
    Vendedor : [null],
    Canal : [null],
    Origen : [null],
    Indicador : [null],
    Responsable : [null],
    Semaforo : [null],
    Variacion : [null],
    Tipo_ProductoId : [null],
    EstadoId : [null]
  });

  constructor(
    private fb: FormBuilder,
    private generalListService: GeneralListService,
    public masterService: MasterService,
    public route: ActivatedRoute,
    public router: Router,
    private solicitudService: SolicitudesService,
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public zone: NgZone,
    public spinner: SpinnerVisibilityService

  ) {
    super('Dashboard de Solicitudes de Credito', applicationRef, dialog, route, router, masterService, zone, spinner);
   }

  ngOnInit(){
    this.cargarCombos();
    this.cargarListeneters();
  }


  cargarCombos(){
    this.getZona();
    this.getEstado();
    this.valueOficina();
    this.getTipoProducto();
  }
  
  
  cargarListeneters(){
    this.listenerSolicitud();
    this.listenerOficina();
    this.listenerTipoProducto();
  }
  getZona(){
    this.generalListService.get(Variables.listas.AdmZona)
      .then(zonaModelList => this.zonaModelList = zonaModelList)
      .catch(error => console.error(error));
  }
  valueOficina(): any{
    this.dashboardForm.get('ZonaId').valueChanges.subscribe(selectedValue => {
      this.oficinaList = [];
      this.generalListService.getByField(Variables.listas.AdmOficina, Variables.listas.AdmZonaId, selectedValue)
        .then((oficinaList: any) => this.oficinaList = oficinaList)
        .catch(error => console.error(error));
    });
  }
  getTipoProducto(){
    this.generalListService.get(Variables.listas.AdmTipoProducto, 'Title')
    .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
    .catch(error => console.error(error));
  }

  async getSolicitudes(idOficina: number = 0, idTipoProducto: number = 0){
    let data: SolicitudCreditoHipotecario[];
    data = await this.generalListService.get(Variables.listas.AdmSolicitudCreditoHipotecario)
    .then(solicitudHipotecarioList => this.solicitudHipotecarioList = solicitudHipotecarioList)
    .catch(error => console.error(error));
    if (idOficina !== 0) {
      data = data.filter(id => id.OficinaId === idOficina);
    }
    if (idTipoProducto !== 0) {
      data = data.filter(id => id.Tipo_ProductoId === idTipoProducto);
    }
    return data;
  }
  async filtraSolicitudes(estado: number) {
    const solicitudes = this.solicitudHipotecarioList.filter(item => item.EstadoId === estado)
      .map(id => { const solicitud = {Precio_Venta: id.Precio_Venta, Fecha_Estado: id.Fecha_Estado, Creado: id.Created};
                   return solicitud; });
    return solicitudes;
  }


  async filtraEstadoSolicitudes(estado: number) {
    const fecha = this.solicitudHipotecarioList.filter(item => item.EstadoId === estado)
      .map(id => id.Fecha_Estado);
    return fecha;
  }

  listenerOficina(){
    this.dashboardForm.controls.OficinaId.valueChanges.subscribe(value => {
      if (value !== undefined) {
          this.listenerSolicitud(value, 0);
      }else{
         this.listenerSolicitud();
      }
    });
  }
  listenerTipoProducto(){
    this.dashboardForm.controls.Tipo_ProductoId.valueChanges.subscribe(value => {
      if (value !== undefined) {
          this.listenerSolicitud(0, value);
      }else{
         this.listenerSolicitud();
      }
    });
  }
   async listenerSolicitud(idOficina: number= 0, idTipoProducto: number = 0){
    const estados = await this.getEstado();
    this.solicitudHipotecarioList = await this.getSolicitudes();
    if (idOficina !== 0) {
      this.solicitudHipotecarioList = await this.getSolicitudes(idOficina, 0);
    }
    if (idTipoProducto !== 0) {
      this.solicitudHipotecarioList = await this.getSolicitudes(0, idTipoProducto);
    }
    this.dashboard = [];
    this.totalExpedientes = 0;
    this.totalTiempoPromedioEstacion = 0;
    this.totalTiempoPromedioTotal = 0;
    this.totalMonto = 0;
    for await (const iterator of estados) {
        const solicitudes = await this.filtraSolicitudes(iterator.Id);
        if ( solicitudes.length !== 0){
          let suma = 0; let tiempo = 0; let tiempoT = 0;
          let tiempoPromedio = 0; let tiempoPromedioTotal = 0;
          const FechaEstado = solicitudes.
            map(id => id.Fecha_Estado);
          const fecha2 = moment();
          for (const item of FechaEstado){
           if (item !== null){
             const fecha1 = moment(item);
             tiempo += fecha2.diff(fecha1, 'days');
             tiempoPromedio = tiempo / FechaEstado.length;
           }
        }
          const FechaCreado = solicitudes.
            map(id => id.Creado);
          for (const item of FechaCreado){
           if (item !== null){
             const fecha1 = moment(item);
             tiempoT += fecha2.diff(fecha1, 'days');
             tiempoPromedioTotal = tiempoT / FechaEstado.length; 
           }
        }
          
          const Monto = solicitudes.
            map(id => id.Precio_Venta);
          for (const item of Monto) {
           if (item !== null && item !== 0 ){
             suma += item;
           }
         }
          const dashBoardElement = {
          Id : iterator.Id,
          Title : iterator.Title,
          Cantidad: solicitudes.length,
          TiempoPromedio: tiempoPromedio,
          TiempoPromedioTotal: tiempoPromedioTotal,
          Monto: suma,
        };
          this.dashboard.push(dashBoardElement);
        }
    }
    
    for (const iterator of this.dashboard) {
       this.totalExpedientes += iterator.Cantidad;
       this.totalTiempoPromedioEstacion += iterator.TiempoPromedio;
       this.totalTiempoPromedioTotal += iterator.TiempoPromedioTotal;
       this.totalMonto += iterator.Monto;
    }
  }


 

  async getEstado(){
    let estados: EstadoModel[];
    estados = await this.generalListService.get(Variables.listas.AdmEstado)
    .then(estadoList => estadoList)
    .catch(error => console.error(error));
    const estadosActivos = estados.filter(item => item.Activo === true);
    return estadosActivos;
  }

}
