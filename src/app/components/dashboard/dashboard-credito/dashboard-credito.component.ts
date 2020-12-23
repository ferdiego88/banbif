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
  solicitudesEstadoList: SolicitudCreditoHipotecario [];
  totalExpedientes = 0;
  totalTiempoPromedioEstacion = 0;
  totalTiempoPromedioTotal = 0;
  totalMonto = 0;
  showSolicitudes = false;
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
    this.listarSolicitudesEstado();
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

  async getSolicitudes(idOficina = 0, idTipoProducto = 0, idEstado = 0){
    let data: SolicitudCreditoHipotecario[];

    const fieldsFilter: string[] = [];
    const valuesFilter: any[] = [];

    if (idOficina !== 0) {
      fieldsFilter.push('OficinaId');
      valuesFilter.push(idOficina);
    }

    if (idTipoProducto !== 0) {
      fieldsFilter.push('Tipo_ProductoId');
      valuesFilter.push(idTipoProducto);
    }

    if (idEstado !== 0) {
      fieldsFilter.push('EstadoId');
      valuesFilter.push(idEstado);
    }

    if (fieldsFilter.length === 0) {
      data = await this.generalListService.get(Variables.listas.AdmSolicitudCreditoHipotecario)
        .then(solicitudHipotecarioList => this.solicitudHipotecarioList = solicitudHipotecarioList)
        .catch(error => console.error(error));
    } else {
      data = await this.generalListService.getByFields(Variables.listas.AdmSolicitudCreditoHipotecario, fieldsFilter, valuesFilter)
        .then(solicitudHipotecarioList => this.solicitudHipotecarioList = solicitudHipotecarioList)
        .catch(error => console.error(error));
    }

    return data;
  }
  filtraSolicitudes(estado: number) {
    const solicitudes = this.solicitudHipotecarioList
      .filter(item => item.EstadoId === estado);
    //   .map(solicitudHipotecario => (
    //     {
    //       Precio_Venta: solicitudHipotecario.Precio_Venta,
    //       Fecha_Estado: solicitudHipotecario.Fecha_Estado,
    //       Creado: solicitudHipotecario.Created
    //     }
    //   )
    // );

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
          this.listarSolicitudesEstado(value, 0);
      }else{
         this.listarSolicitudesEstado();
      }
    });
  }
  listenerTipoProducto(){
    this.dashboardForm.controls.Tipo_ProductoId.valueChanges.subscribe(value => {
      if (value !== undefined) {
          this.listarSolicitudesEstado(0, value);
      }else{
         this.listarSolicitudesEstado();
      }
    });
  }
   async listarSolicitudesEstado(idOficina: number= 0, idTipoProducto: number = 0){
    this.showLoading();
    const estados = await this.getEstado();

    this.solicitudHipotecarioList = await this.getSolicitudes(idOficina, idTipoProducto);

    this.dashboard = [];
    this.totalExpedientes = 0;
    this.totalTiempoPromedioEstacion = 0;
    this.totalTiempoPromedioTotal = 0;
    this.totalMonto = 0;

    await estados.forEach(
      async estado => {
        // const solicitudes = await this.getSolicitudes(idOficina, idTipoProducto, estado.Id);
        const solicitudes = this.filtraSolicitudes(estado.Id);
        if (solicitudes.length !== 0){
          let suma = 0, tiempo = 0, tiempoT = 0, tiempoPromedio = 0, tiempoPromedioTotal = 0;
          const fechaActual = moment();

          solicitudes.forEach(solicitud => {
            if (solicitud.Fecha_Estado !== null) {
              const fechaEstado = moment(solicitud.Fecha_Estado);
              tiempo += fechaActual.diff(fechaEstado, 'days');
              tiempoPromedio = tiempo / solicitudes.length;
            }

            if (solicitud.Created !== null) {
              const fechaCreacion = moment(solicitud.Created);
              tiempoT += fechaActual.diff(fechaCreacion, 'days');
              tiempoPromedioTotal = tiempoT / solicitudes.length;
            }

            solicitud.Precio_Venta && solicitud.Precio_Venta !== 0 && (suma += solicitud.Precio_Venta);
          });

          const dashBoardElement = {
            Id : estado.Id,
            Title : estado.Title,
            Cantidad: solicitudes.length,
            TiempoPromedio: tiempoPromedio,
            TiempoPromedioTotal: tiempoPromedioTotal,
            Monto: suma,
          };

          this.dashboard.push(dashBoardElement);
        }
      }
    );

    // for await (const estado of estados) {
    //   const solicitudes = await this.filtraSolicitudes(estado.Id);

    //   if ( solicitudes.length !== 0){
    //     let suma = 0; let tiempo = 0; let tiempoT = 0;
    //     let tiempoPromedio = 0; let tiempoPromedioTotal = 0;

    //     const FechaEstado = solicitudes.map(id => id.Fecha_Estado);
    //     const fechaActual = moment();

    //     for (const item of FechaEstado){
    //       if (item !== null){
    //         const fecha1 = moment(item);
    //         tiempo += fechaActual.diff(fecha1, 'days');
    //         tiempoPromedio = tiempo / FechaEstado.length;
    //       }
    //     }

    //     const FechaCreado = solicitudes.map(id => id.Created);

    //     for (const item of FechaCreado){
    //       if (item !== null){
    //         const fecha1 = moment(item);
    //         tiempoT += fechaActual.diff(fecha1, 'days');
    //         tiempoPromedioTotal = tiempoT / FechaEstado.length;
    //       }
    //     }

    //     const Monto = solicitudes.map(id => id.Precio_Venta);

    //     for (const item of Monto) {
    //       if (item !== null && item !== 0 ){
    //         suma += item;
    //       }
    //     }

    //     const dashBoardElement = {
    //       Id : estado.Id,
    //       Title : estado.Title,
    //       Cantidad: solicitudes.length,
    //       TiempoPromedio: tiempoPromedio,
    //       TiempoPromedioTotal: tiempoPromedioTotal,
    //       Monto: suma,
    //     };

    //     this.dashboard.push(dashBoardElement);
    //   }
    // }

    for (const iterator of this.dashboard) {
       this.totalExpedientes += iterator.Cantidad;
       this.totalTiempoPromedioEstacion += iterator.TiempoPromedio;
       this.totalTiempoPromedioTotal += iterator.TiempoPromedioTotal;
       this.totalMonto += iterator.Monto;
    }

    this.hideLoading();
  }

  async getEstado(){
    let estados: EstadoModel[];
    estados = await this.generalListService.get(Variables.listas.AdmEstado)
    .then(estadoList => estadoList)
    .catch(error => console.error(error));
    const estadosActivos = estados.filter(item => item.Activo === true);
    return estadosActivos;
  }

  getSolicitudesPorEstado(estadoId: number) {
    // alert('hola soy el click ' + estadoId);
    const solicitudes = this.filtraSolicitudes(estadoId);
    this.solicitudesEstadoList = solicitudes;
    this.showSolicitudes = true;
  }
}
