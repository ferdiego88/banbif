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
  cuentaCreaExpediente = 0;
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
    this.getSolicitudes();
    this.cargarCombos();
  }


  cargarCombos(){
    this.getZona();
    this.getEstado();
    this.valueOficina();
    this.getTipoProducto();
    this.listenerSolicitud();
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

  async getSolicitudes(){
    const data = await this.generalListService.get(Variables.listas.AdmSolicitudCreditoHipotecario)
    .then(solicitudHipotecarioList => this.solicitudHipotecarioList = solicitudHipotecarioList)
    .catch(error => console.error(error));
    return data;
  }
   async listenerSolicitud(){
    const estados = await this.getEstado();
    this.solicitudHipotecarioList = await this.getSolicitudes();
    this.dashboard = [];
    for await (const iterator of estados) {
       const solicitudes = await this.filtraSolicitudes(iterator.Id);
       let suma = 0;
       for (const item of solicitudes) {
         if (item !== null && item !== 0 ){
           suma += item;
         }
       }
       const dashBoardElement = {
        Id : iterator.Id,
        Title : iterator.Title,
        Cantidad: solicitudes.length,
        Monto: suma,
      };
       this.dashboard.push(dashBoardElement);
    }
  }


  async filtraSolicitudes(estado: number) {
    const solicitudes = this.solicitudHipotecarioList.filter(item => item.EstadoId === estado)
      .map(id => id.Precio_Venta);
    return solicitudes;
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
