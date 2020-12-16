import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SolicitudCreditoHipotecario, TipoProductoModel, ZonaModel } from 'src/app/shared/models/fisics';
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
  estadoList: TipoProductoModel [];
  tipoProductoList: TipoProductoModel [];
  estadoCreaExpedienteList: TipoProductoModel [];
  estadoRegistraCPMList: TipoProductoModel [];
  estadoObservadoCPMList: TipoProductoModel [];
  estadoEvaluacionRiesgosList: TipoProductoModel [];
  estadoObservadoRiesgosList: TipoProductoModel [];
  estadoVerificacionRiesgosList: TipoProductoModel [];
  estadoDesestimadoList: TipoProductoModel [];
  estadoRechazadoList: TipoProductoModel [];
  estadoAprobadoList: TipoProductoModel [];
  estadoAsignacionRiesgosList: TipoProductoModel [];
  solicitudHipotecarioList: SolicitudCreditoHipotecario [];
  cuentaCreaExpediente = 0;
  cuentaRegistroCPM = 0;
  cuentaObservadoCPM = 0;
  cuentaEvaluacionRiesgos = 0;
  cuentaObservadoRiesgos = 0;
  cuentaVerificacionRiesgos = 0;
  cuentaDesestimado = 0;
  cuentaRechazado = 0;
  cuentaAprobado = 0;
  totalSolicitudes = 0;
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
  }

  cargarCombos(){
    this.getZona();
    this.getEstado();
    this.valueOficina();
    this.getTipoProducto();
    this.cargarCantidadExpedientes();
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

  getSolicitudesCredito(){
    this.generalListService.get(Variables.listas.AdmSolicitudCreditoHipotecario)
    .then(solicitudHipotecarioList => this.solicitudHipotecarioList = solicitudHipotecarioList)
    .catch(error => console.error(error));
    return this.solicitudHipotecarioList;
  }

  async getcuentaSolicitudesCredito(listaSolicitud: TipoProductoModel[], estado: number){
    const total = await this.generalListService.getByField(Variables.listas.AdmSolicitudCreditoHipotecario,
      Variables.listas.AdmEstado, estado)
      .then((lista) => 
      {listaSolicitud = lista;
       const cantidad = listaSolicitud.length; return cantidad; })
        .catch(error => {console.error(error); return 0; });
    return total;
  }

  async obtenerCantidad(){
    this.cuentaCreaExpediente = await
    this.getcuentaSolicitudesCredito(this.estadoCreaExpedienteList, Variables.constantes.EstadoCreaExpedienteId);
    this.cuentaRegistroCPM = await
    this.getcuentaSolicitudesCredito(this.estadoRegistraCPMList, Variables.constantes.EstadoRegistroCPM);
    this.cuentaObservadoCPM = await
    this.getcuentaSolicitudesCredito(this.estadoObservadoCPMList, Variables.constantes.EstadoObservadoCPM);
    this.cuentaEvaluacionRiesgos = await
    this.getcuentaSolicitudesCredito(this.estadoObservadoCPMList, Variables.constantes.EstadoEvaluacionRiesgos);
    this.cuentaObservadoRiesgos = await
    this.getcuentaSolicitudesCredito(this.estadoObservadoCPMList, Variables.constantes.EstadoObservadoRiesgos);
    this.cuentaVerificacionRiesgos = await
    this.getcuentaSolicitudesCredito(this.estadoObservadoCPMList, Variables.constantes.EstadoVerificacionRiesgos);
    this.cuentaDesestimado = await
    this.getcuentaSolicitudesCredito(this.estadoObservadoCPMList, Variables.constantes.EstadoDesestimado);
    this.cuentaRechazado = await
    this.getcuentaSolicitudesCredito(this.estadoObservadoCPMList, Variables.constantes.EstadoRechazado);
    this.cuentaAprobado = await
    this.getcuentaSolicitudesCredito(this.estadoObservadoCPMList, Variables.constantes.EstadoAprobadoSinVerificacion);
    this.totalSolicitudes = this.cuentaCreaExpediente + this.cuentaRegistroCPM + this.cuentaObservadoCPM + this.cuentaEvaluacionRiesgos
    + this.cuentaObservadoRiesgos + this.cuentaVerificacionRiesgos + this.cuentaDesestimado + this.cuentaRechazado + this.cuentaAprobado;
  }

  cargarCantidadExpedientes(){
    this.obtenerCantidad();
  }


  getEstado(){
    this.generalListService.get(Variables.listas.AdmEstado)
    .then(estadoList => this.estadoList = estadoList)
    .catch(error => console.error(error));
  }

}
