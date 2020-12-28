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

export interface Canal {
  name: string;
  id: number;
}
const CANAL_DATA: Canal[] = [
  {id: 1, name: 'FFVV'},
  {id: 2, name: 'Red de Oficinas'},

];

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
  data: Canal[] = CANAL_DATA;
  zonaModelList: ZonaModel [];
  oficinaList: TipoProductoModel [];
  estadoList: EstadoModel [];
  dashboard: DashboardModel [];
  tipoProductoList: TipoProductoModel [];
  solicitudANSList: SolicitudCreditoHipotecario [];
  solicitudANSPorEstadoList: SolicitudCreditoHipotecario [];
  solicitudHipotecarioList: SolicitudCreditoHipotecario [];
  flujoSeguimientoList: SolicitudCreditoHipotecario [];
  solicitudesEstadoList: SolicitudCreditoHipotecario [];

  totalExpedientes = 0;
  totalTiempoPromedioEstacion = 0;
  totalTiempoPromedioTotal = 0;
  totalMonto = 0;
  totalFueraANS = 0;
  fueraANSAcumulado = 0;
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
    this.listenerZona();
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

  async getSolicitudes(idZona = 0, idOficina = 0, idTipoProducto = 0, idEstado = 0){
    let data: SolicitudCreditoHipotecario[];

    const fieldsFilter: string[] = [];
    const valuesFilter: any[] = [];

    if (idZona !== 0) {
      fieldsFilter.push('ZonaId');
      valuesFilter.push(idZona);
    }
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

  listenerOficina(){
    this.dashboardForm.controls.OficinaId.valueChanges.subscribe(value => {
      if (value !== undefined) {
          this.showSolicitudes = false;
          this.fueraANSAcumulado = 0;
          this.listarSolicitudesEstado(0, value, 0);
      }else{
         this.showSolicitudes = false;
         this.fueraANSAcumulado = 0;
         this.listarSolicitudesEstado();
      }
    });
  }

  listenerZona(){
    this.dashboardForm.controls.ZonaId.valueChanges.subscribe(value => {
      console.log(value);
      if (value !== Variables.constantes.ZonaIDFFVV) {
        this.dashboardForm.controls.Canal.setValue(2);
      } else {
        this.dashboardForm.controls.Canal.setValue(1);
      }
      if (value !== undefined) {
        this.showSolicitudes = false;
        this.fueraANSAcumulado = 0;
        this.listarSolicitudesEstado(value, 0, 0);
    }else{
       this.dashboardForm.controls.Canal.setValue('Todas');
       this.showSolicitudes = false;
       this.fueraANSAcumulado = 0;
       this.listarSolicitudesEstado();
    }
    });
  }

  listenerTipoProducto(){
    this.dashboardForm.controls.Tipo_ProductoId.valueChanges.subscribe(value => {
      if (value !== undefined) {
          this.showSolicitudes = false;
          this.fueraANSAcumulado = 0;
          this.listarSolicitudesEstado(0, 0, value);
      }else{
         this.showSolicitudes = false;
         this.fueraANSAcumulado = 0;
         this.listarSolicitudesEstado();
      }
    });
  }
   async listarSolicitudesEstado(idZona: number = 0, idOficina: number= 0, idTipoProducto: number = 0){
    this.showLoading();
    const estados = await this.getEstado();

    this.solicitudHipotecarioList = await this.getSolicitudes(idZona, idOficina, idTipoProducto);

    this.dashboard = [];
    this.totalExpedientes = 0;
    this.totalTiempoPromedioEstacion = 0;
    this.totalTiempoPromedioTotal = 0;
    this.totalMonto = 0;
    this.totalFueraANS = 0;
    this.solicitudANSList = [];
    await estados.forEach(
      async estado => {
        // const solicitudes = await this.getSolicitudes(idOficina, idTipoProducto, estado.Id);
        const solicitudes = this.filtraSolicitudes(estado.Id);
        if (solicitudes.length !== 0){
          let suma = 0, tiempo = 0, tiempoT = 0, tiempoPromedio = 0, tiempoPromedioTotal = 0;
          const fechaActual = moment();
          let fueraANS = 0;
          let contador = 0;
          console.log(solicitudes);
          solicitudes.forEach(solicitud => {
            if (solicitud.Fecha_Estado !== null) {
              const fechaEstado = moment(solicitud.Fecha_Estado);
              const tiempoPromedioEstacion = this.calcBusinessDays(fechaEstado, fechaActual);
              if (tiempoPromedioEstacion >= estado.Valor_ANS) {
                fueraANS++;
                this.fueraANSAcumulado ++;
                this.solicitudANSList.push(solicitudes[contador]);
              }
              tiempo += tiempoPromedioEstacion;
              tiempoPromedio = tiempo / solicitudes.length;
            }
            contador++;
            if (solicitud.Created !== null) {
              const fechaCreacion = moment(solicitud.Created);
              const tiempoPromedioT = this.calcBusinessDays(fechaCreacion, fechaActual);
              // tiempoT += fechaActual.diff(fechaCreacion, 'days');
              tiempoT += tiempoPromedioT;
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
            FueraANS: fueraANS,
            Monto: suma,
            FueraANSAcumulado: this.fueraANSAcumulado,
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

    for (const totales of this.dashboard) {
       this.totalExpedientes += totales.Cantidad;
       this.totalTiempoPromedioEstacion += totales.TiempoPromedio;
       this.totalTiempoPromedioTotal += totales.TiempoPromedioTotal;
       this.totalMonto += totales.Monto;
       this.totalFueraANS += totales.FueraANS;
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
    this.showLoading();
    const solicitudes = this.filtraSolicitudes(estadoId);
    this.solicitudesEstadoList = solicitudes;
    this.hideLoading();
    this.showSolicitudes = true;
  }
  getSolicitudesANS(cantidadSolicitudesANS: number, estadoId?: number) {
    let solicitudes;
    if (estadoId) {
      solicitudes = this.solicitudANSList
        .filter(item => item.EstadoId === estadoId);
    } else {
      solicitudes = this.solicitudANSList.slice(0, cantidadSolicitudesANS);
    }
    this.solicitudesEstadoList = solicitudes;
    this.showSolicitudes = true;
  }

   calcBusinessDays(startDate, endDate) {
    // This makes no effort to account for holidays
    // Counts end day, does not count start day

    // make copies we can normalize without changing passed in objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // initial total
    let totalBusinessDays = 0;

    // normalize both start and end to beginning of the day
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const current = new Date(start);
    current.setDate(current.getDate() + 1);
    let day;
    // loop through each day, checking
    while (current <= end) {
        day = current.getDay();
        if (day >= 1 && day <= 5) {
            ++totalBusinessDays;
        }
        current.setDate(current.getDate() + 1);
    }
    return totalBusinessDays;
}
}
