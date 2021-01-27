import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {SolicitudCreditoHipotecario, TipoProductoModel, ZonaModel, EstadoModel, DashboardHipotecarioModel, Canal} from 'src/app/shared/models/fisics';
import { User } from 'src/app/shared/models/fisics/base/User';
import { GeneralListService } from '../../../shared/services/general-list.service';
import { SolicitudesService } from '../../../shared/services/solicitudes.service';
import { UserService } from '../../../shared/services/user.service';
import { MasterService } from '../../../shared/services/master.service';
import { Variables } from '../../../shared/variables';
import * as _moment from 'moment';
import { FormularioBase } from '../../../shared/pages/formularioBase';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerVisibilityService } from 'ng-http-loader';

const moment = _moment;
export interface Meses {
  name: string;
  id: number;
}
export interface Semaforo {
  color: string;
  id: number;
}
export interface Variacion {
  title: string;
  id: number;
}
export interface Year {
  year: number;
  id: number;
}


const SEMAFORO_DATA: Semaforo[] = [
  { id: 0, color: 'Rojo' },
  { id: 1, color: 'Ambar' },
  { id: 2, color: 'Verde' },
];
const VARIACION_DATA: Variacion[] = [
  { id: 0, title: 'Tendencia a la Baja' },
  { id: 1, title: 'Tendencia Plana' },
  { id: 2, title: 'Tendencia al Alza' },
];

const MESES_DATA: Meses[] = [
  { id: 0, name: 'Enero' },
  { id: 1, name: 'Febrero' },
  { id: 2, name: 'Marzo' },
  { id: 3, name: 'Abril' },
  { id: 4, name: 'Mayo' },
  { id: 5, name: 'Junio' },
  { id: 6, name: 'Julio' },
  { id: 7, name: 'Agosto' },
  { id: 8, name: 'Setiembre' },
  { id: 9, name: 'Octubre' },
  { id: 10, name: 'Noviembre' },
  { id: 11, name: 'Diciembre' },
];

const CANAL_DATA: Canal[] = [
  { id: 1, name: 'FFVV' },
  { id: 2, name: 'Red de Oficinas' },
];
@Component({
  selector: 'app-dashboard-hipotecario',
  templateUrl: './dashboard-hipotecario.component.html',
  styleUrls: ['./dashboard-hipotecario.component.scss'],
})

export class DashboardHipotecarioComponent extends FormularioBase implements OnInit {
  data: Meses[] = MESES_DATA;
  variacionData: Variacion[] = VARIACION_DATA;
  canalData: Canal[] = CANAL_DATA;
  semaforoData: Semaforo[] = SEMAFORO_DATA;
  YEARS: Year[];
  usersList: User[];
  zonaModelList: ZonaModel[];
  oficinaList: TipoProductoModel[];
  flujoSeguimientoEtapaLista: TipoProductoModel[];
  flujoSeguimientoEstadoList: TipoProductoModel[];
  dashboardList: DashboardHipotecarioModel[];
  dashboardReprocesosList: DashboardHipotecarioModel[];
  solicitudesEstadoList: SolicitudCreditoHipotecario[];
  flujoSeguimientoEstadoAnteriorList: TipoProductoModel[];
  dashboardAnteriorList: DashboardHipotecarioModel[];
  solicitudesEstadoAnteriorList: SolicitudCreditoHipotecario[];

  flujoSeguimientoList: TipoProductoModel[];
  solicitudMesList: SolicitudCreditoHipotecario[];

  flujoSeguimientoAnteriorList: TipoProductoModel[];
  solicitudMesAnteriorList: SolicitudCreditoHipotecario[];

  solicitudHipotecarioList: SolicitudCreditoHipotecario[];
  cantidadSolicitudesPorMes: number;
  cantidadSolicitudesConcluidas: number;
  cantidadSolicitudesReprocesos: number;
  porcentajeExpedientesConcluidos: number;
  porcentajeExpedientesReprocesos: number;
  porcentajeExpedientesANS: number;

  cantidadSolicitudesPorMesAnterior: number;
  cantidadSolicitudesConcluidasAnterior: number;
  cantidadSolicitudesReprocesosAnterior: number;
  porcentajeExpedientesConcluidosAnterior: number;
  porcentajeExpedientesReprocesosAnterior: number;
  porcentajeExpedientesANSAnterior: number;
  iconoANS: string;
  sentimentANS: string;
  iconoANSPrevious: string;
  sentimentANSPrevious: string;
  iconoANSVariation: string;
  sentimentANSVariation: string;

  iconoConcluded: string;
  sentimentConcluded: string;
  iconoConcludedPrevious: string;
  sentimentConcludedPrevious: string;
  iconoConcludedVariation: string;
  sentimentConcludedVariation: string;

  iconoReprocesos: string;
  sentimentReprocesos: string;
  iconoReprocesosPrevious: string;
  sentimentReprocesosPrevious: string;
  iconoReprocesosVariation: string;
  sentimentReprocesosVariation: string;

  solicitudANSList: SolicitudCreditoHipotecario[];
  cantidadsolicitudANSMes: number;

  cantidadsolicitudANSPrueba: number;
  cantidadsolicitudANSMesPrueba: number;

  cantidadsolicitudANSMesAnterior: number;
  solicitudANSAnteriorList: SolicitudCreditoHipotecario[];
  numeradorCPM: number;
  showIndicadores = false;
  showDetalleConcluidos = false;
  showDetalleReprocesos = false;
  showDetalleANS = false;
  hipotecarioForm = this.fb.group({
    Year: [null],
    MesId: [null],
    ZonaId: [null],
    OficinaId: [null],
    Vendedor: [null],
    Canal: [null],
    Origen: [null],
    Indicador: [null],
    Responsable: [null],
    Semaforo: [null],
    Variacion: [null],
    EstadoId: [null],
  });
  constructor(
    private fb: FormBuilder,
    private generalListService: GeneralListService,
    public masterService: MasterService,
    public route: ActivatedRoute,
    public router: Router,
    private solicitudService: SolicitudesService,
    private userService: UserService,
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public zone: NgZone,
    public spinner: SpinnerVisibilityService
  ) {
    super(
      'Dashboard de Solicitudes de Credito',
      applicationRef,
      dialog,
      route,
      router,
      masterService,
      zone,
      spinner
    );

  }

  ngOnInit(): void {
    this.hipotecarioForm.controls.Year.setValue(new Date().getFullYear());
    this.hipotecarioForm.controls.MesId.setValue(new Date().getMonth());
    // this.toListSolicitudes();
    this.loadListeners();
    this.getEjecutivo();
    this.loadCombos();
    //this.loadLists();
    // this.hideIcons();
  }

  loadCombos(){
    this.getZona();
    this.getOficina();
    this.getYears();
    // this.getEstado();
  }
  // async loadLists(){
  //  await this.getFlujoSeguimiento();
  // }

  loadListeners(){
    // this.listenerMonth();
    this.listenerZona();
  }


    calculateIndicators(){
      this.filterSolicitudesEstado();
      this.cantidadSolicitudesPorMes = this.solicitudMesList.length;
      this.cantidadSolicitudesPorMesAnterior = this.solicitudMesAnteriorList.length;

      this.cantidadSolicitudesConcluidas = this.countRequestConcluded(this.solicitudMesList);
      this.cantidadSolicitudesReprocesos = this.countReproccess(this.flujoSeguimientoList);

      this.cantidadSolicitudesConcluidasAnterior = this.countRequestConcluded(this.solicitudMesAnteriorList);
      this.cantidadSolicitudesReprocesosAnterior = this.countReproccess(this.flujoSeguimientoAnteriorList);

      this.porcentajeExpedientesConcluidos = (this.cantidadSolicitudesConcluidas / this.cantidadSolicitudesPorMes) * 100;
      this.porcentajeExpedientesReprocesos = (this.cantidadSolicitudesReprocesos / this.cantidadSolicitudesPorMes) * 100;

     //  this.porcentajeExpedientesANS = this.cantidadsolicitudANSMes - this.cantidadSolicitudesPorMes;
     //  // console.log(this.cantidadsolicitudANSMesList);
     //  this.porcentajeExpedientesANSAnterior = (this.cantidadSolicitudesReprocesos / this.cantidadSolicitudesPorMes) * 100;

      this.porcentajeExpedientesConcluidosAnterior =
      (this.cantidadSolicitudesConcluidasAnterior / this.cantidadSolicitudesPorMesAnterior) * 100;
      this.porcentajeExpedientesReprocesosAnterior =
      (this.cantidadSolicitudesReprocesosAnterior / this.cantidadSolicitudesPorMesAnterior) * 100;

      const{icono: iconoConcluded, sentiment: sentimentConcluded, resultado: resultadoConcluded} =
      this.evaluarProcesos(this.porcentajeExpedientesConcluidos);
      this.iconoConcluded = iconoConcluded;
      this.sentimentConcluded = sentimentConcluded;
      const{icono: iconoConcludedPrevious, sentiment: sentimentConcludedPrevious, resultado: resultadoConcludedPrevious} =
      this.evaluarProcesos(this.porcentajeExpedientesConcluidosAnterior);
      this.iconoConcludedPrevious = iconoConcludedPrevious;
      this.sentimentConcludedPrevious = sentimentConcludedPrevious;
      const [variacionConcluidos, colorVariacion] = this.evaluarVariacion(resultadoConcluded, resultadoConcludedPrevious);
      this.iconoConcludedVariation = variacionConcluidos;
      this.sentimentConcludedVariation = colorVariacion;
      const{icono: iconoReprocesos, sentiment: sentimentReprocesos, resultado: resultadoReprocesos} =
      this.evaluarReProcesos(this.porcentajeExpedientesReprocesos);
      this.iconoReprocesos = iconoReprocesos;
      this.sentimentReprocesos = sentimentReprocesos;
      const{icono: iconoReprocesosPrevious, sentiment: sentimentReprocesosPrevious, resultado: resultadoReprocesosPrevious} =
      this.evaluarReProcesos(this.porcentajeExpedientesReprocesosAnterior);
      this.iconoReprocesosPrevious = iconoReprocesosPrevious;
      this.sentimentReprocesosPrevious = sentimentReprocesosPrevious;
      const [variacionReprocesos, colorReprocesos] = this.evaluarVariacionReprocesos(resultadoReprocesos, resultadoReprocesosPrevious);
      this.iconoReprocesosVariation = variacionReprocesos;
      this.sentimentReprocesosVariation = colorReprocesos;
    }

      getMonthRequest(mes: number){
      const solicitudes = this.solicitudHipotecarioList;
      // console.log(this.flujoSeguimientoEtapaLista.map(indx => indx.SolicitudHipotecarioId));
      let solicitudPorMes: SolicitudCreditoHipotecario;
      let solicitudPorMesAnterior: SolicitudCreditoHipotecario;
      let solicitudFlujoSeguimiento: TipoProductoModel[];
      let solicitudFlujoSeguimientoAnterior: TipoProductoModel[];
      this.solicitudMesList = [];
      this.solicitudMesAnteriorList = [];
      this.flujoSeguimientoList = [];
      this.flujoSeguimientoAnteriorList = [];
      let mesAnterior: number;
      const yearSelected = this.hipotecarioForm.controls.Year.value;
      let yearSelectedAnterior = this.hipotecarioForm.controls.Year.value;
      if (mes === 0) {
        mesAnterior = 11;
        yearSelectedAnterior = yearSelectedAnterior - 1;
      } else {
        mesAnterior = mes - 1;
      }
      // console.log(mesAnterior);
      solicitudes.forEach(solicitud => {
          const fecha = moment(solicitud.Created).format('DD-MM-YYYY');
          const fechaCreacion = moment(fecha, 'DD-MM-YYYY').toDate();
          const mesCreacion  = fechaCreacion.getMonth();
          const yearCreacion  = fechaCreacion.getFullYear();
          // console.log(yearCreacion);
          if (mesCreacion === mes && yearSelected === yearCreacion) {
            solicitudFlujoSeguimiento = this.flujoSeguimientoEtapaLista.filter(item => item.SolicitudHipotecarioId === solicitud.Id);
            solicitudFlujoSeguimiento.forEach( solicitudFlujo => {
              this.flujoSeguimientoList.push(solicitudFlujo);
            });
            solicitudPorMes = this.solicitudHipotecarioList.find(item => item.Id === solicitud.Id);
            this.solicitudMesList.push(solicitudPorMes);
             }
          if (mesCreacion === mesAnterior && yearSelectedAnterior === yearCreacion) {
            solicitudFlujoSeguimientoAnterior =
              this.flujoSeguimientoEtapaLista.filter(item => item.SolicitudHipotecarioId === solicitud.Id);

            solicitudFlujoSeguimientoAnterior.forEach( solicitudFlujo => {
              this.flujoSeguimientoAnteriorList.push(solicitudFlujo);
            });

            solicitudPorMesAnterior = this.solicitudHipotecarioList.find(item => item.Id === solicitud.Id);
            this.solicitudMesAnteriorList.push(solicitudPorMesAnterior);

             }
      });
      console.log(this.flujoSeguimientoAnteriorList);
     }

     async filterSolicitudesEstado(){
      const estados = await this.getEstado();
      this.dashboardList = [];
      this.dashboardReprocesosList = [];
      this.flujoSeguimientoEstadoList = [];
      this.solicitudesEstadoList = [];
      // this.dashboardAnteriorList = [];
      this.flujoSeguimientoEstadoAnteriorList = [];
      this.solicitudesEstadoAnteriorList = [];
      this.cantidadsolicitudANSMes = 0;
      this.cantidadsolicitudANSMesPrueba = 0;
      this.cantidadsolicitudANSMesAnterior = 0;
      // const prueba = this.flujoSeguimientoList.map(sol => sol.SolicitudHipotecarioId);
      // console.log(prueba);
      estados.forEach(estado => {
        this.solicitudANSList = [];
        this.solicitudANSAnteriorList = [];
        let porcentajeExpediente = 0;
        let porcentajeExpedienteAnterior = 0;
        let porcentajeReprocesos = 0;
        let porcentajeReprocesosAnterior = 0;
        this.solicitudesEstadoList = this.solicitudMesList.filter(solicitud => solicitud.EstadoId === estado.Id);
        this.getANSList(this.solicitudesEstadoList, estado, this.solicitudANSList);
        // console.log(this.solicitudANSList);
        const dataSeguimiento = this.flujoSeguimientoList.filter(flujosolicitud => flujosolicitud.EstadoId === estado.Id)
          .map(codigo => codigo.SolicitudHipotecarioId);
        const dataArray = new Set(dataSeguimiento);
        const result = [...dataArray];
        console.log(this.solicitudesEstadoList);
        console.log(result);
        this.solicitudesEstadoAnteriorList = this.solicitudMesAnteriorList.filter(solicitud => solicitud.EstadoId === estado.Id);
        this.getANSList(this.solicitudesEstadoAnteriorList, estado, this.solicitudANSAnteriorList);
        // console.log(this.solicitudANSAnteriorList);
        this.flujoSeguimientoEstadoAnteriorList =
        this.flujoSeguimientoAnteriorList.filter(flujosolicitud => flujosolicitud.EstadoId === estado.Id);
        const solicitudes = this.solicitudesEstadoList.length;

        // let flujoSeguimiento = this.flujoSeguimientoEstadoList.length;
        let flujoSeguimiento = result.length;

        const solicitudesAnterior = this.solicitudesEstadoAnteriorList.length;
        const flujoSeguimientoAnterior = this.flujoSeguimientoEstadoAnteriorList.length;
        const cantidadSolicitudANS = this.solicitudANSList.length;

        this.cantidadsolicitudANSPrueba = solicitudes - this.solicitudANSList.length;
        this.cantidadsolicitudANSMesPrueba += this.cantidadsolicitudANSPrueba;

        const cantidadSolicitudANSAnterior = this.solicitudANSAnteriorList.length;
        this.cantidadsolicitudANSMes += cantidadSolicitudANS;
        this.cantidadsolicitudANSMesAnterior += cantidadSolicitudANSAnterior;

        const porcentajeANS = (1 - (cantidadSolicitudANS / solicitudes)) * 100;
        const porcentajeANSANterior = (1 - (cantidadSolicitudANSAnterior / solicitudesAnterior)) * 100;

        let numeradorConcluidos = flujoSeguimiento - solicitudes;
        if (solicitudes > flujoSeguimiento) {
          // porcentajeExpediente = 0;
          porcentajeExpediente = (100 - (solicitudes / this.solicitudMesList.length) * 100);
          numeradorConcluidos = solicitudes;
          flujoSeguimiento = this.solicitudMesList.length;
        } else {
          porcentajeExpediente = (numeradorConcluidos / flujoSeguimiento) * 100;
          porcentajeReprocesos = (flujoSeguimiento / this.solicitudMesList.length) * 100;
        }
        if (solicitudesAnterior){
          if (solicitudesAnterior > flujoSeguimientoAnterior) {
            // porcentajeExpediente = 0;
            porcentajeExpedienteAnterior = 100 - (solicitudesAnterior / this.solicitudMesAnteriorList.length) * 100;
          } else {
            porcentajeReprocesosAnterior = (flujoSeguimientoAnterior / this.solicitudMesAnteriorList.length) * 100;
            porcentajeExpedienteAnterior = ((flujoSeguimientoAnterior - solicitudesAnterior) / flujoSeguimientoAnterior) * 100;
          }
        }
        const {icono, sentiment, resultado} = this.evaluarProcesos(porcentajeExpediente);
        const {icono: iconoPrevious, sentiment: sentimentPrevious, resultado: resultadoPrevious} =
        this.evaluarProcesos(porcentajeExpedienteAnterior);

        const {icono: iconoReproceso, sentiment: sentimentReproceso, resultado: resultadoReproceso} =
         this.evaluarReProcesos(porcentajeReprocesos);
        const {icono: iconoReprocesoPrevio, sentiment: sentimentReprocesoPrevio, resultado: resultadoReprocesoPrevio} =
        this.evaluarReProcesos(porcentajeReprocesosAnterior);
        const [variacionReproceso, colorReproceso] = this.evaluarVariacion(resultadoReproceso, resultadoReprocesoPrevio);

        const {icono: iconoANSDetalle, sentiment: sentimentANSDetalle, resultado: resultadoANSDetalle} =
        this.evaluarProcesos(porcentajeANS);
        const {icono: iconoANSPreviousDetalle, sentiment: sentimentANSPreviousDetalle, resultado: resultadoANSPreviousDetlle} =
        this.evaluarProcesos(porcentajeANSANterior);
        const [variacionANSDetalle, colorANSDetalle] = this.evaluarVariacion(resultadoANSDetalle, resultadoANSPreviousDetlle);
        const [variacionConcluidos, colorVariacion] = this.evaluarVariacion(resultado, resultadoPrevious);
        const estadoElement = {
          Id: estado.Id,
          Title: estado.Title,
          CantidadSolicitudes: solicitudes,
          CantidadSolicitudesConcluidas: numeradorConcluidos,
          CantidadSolicitudesANS: this.cantidadsolicitudANSPrueba,
          CantidadSolicitudesANSAnterior: cantidadSolicitudANSAnterior,
          FlujoSeguimiento: flujoSeguimiento,
          Porcentaje: porcentajeExpediente,
          PorcentajeReprocesos: porcentajeReprocesos,
          PorcentajeAnterior: porcentajeExpedienteAnterior,
          PorcentajeANS: porcentajeANS,
          PorcentajeANSAnterior: porcentajeANSANterior,
          Icono: icono,
          Sentimiento: sentiment,
          IconoAnterior: iconoPrevious,
          SentimientoAnterior: sentimentPrevious,
          Variacion: variacionConcluidos,
          ColorVariacion: colorVariacion,
          SentimientoANS: sentimentANSDetalle,
          IconoANS: iconoANSDetalle,
          SentimientoANSAnterior: sentimentANSPreviousDetalle,
          IconoANSAnterior: iconoANSPreviousDetalle,
          VariacionANS: variacionANSDetalle,
          ColorVariacionANS: colorANSDetalle,
          IconoReproceso: iconoReproceso,
          SentimientoReproceso: sentimentReproceso,
          IconoReprocesoAnterior: iconoReprocesoPrevio,
          SentimientoReprocesoAnterior: sentimentReprocesoPrevio,
          VariacionReproceso: variacionReproceso,
          ColorVariacionReproceso: colorReproceso,

        };
        if (estado.Id === Variables.constantes.EstadoObservadoCPM || estado.Id === Variables.constantes.EstadoObservadoRiesgos) {
          this.dashboardReprocesosList.push(estadoElement);
        }
        if (numeradorConcluidos > 0  && estado.Id !== Variables.constantes.EstadoAsignacionRiesgos &&
            estado.Id !== Variables.constantes.EstadoRegularizacionCPM &&
            estado.Id !== Variables.constantes.EstadoPreTerminado &&
            estado.Id !== Variables.constantes.EstadoAprobadoConVerificacion &&
            estado.Id !== Variables.constantes.EstadoAprobadoSinVerificacion &&
            estado.Id !== Variables.constantes.EstadoDesestimiento &&
            estado.Id !== Variables.constantes.EstadoPreTerminado &&
            estado.Id !== Variables.constantes.EstadoRegularizacionCPM) {
          this.dashboardList.push(estadoElement);
          this.modifiyDashboardList();
        }
          });
      this.porcentajeExpedientesANS = (1 - (this.cantidadsolicitudANSMes / this.solicitudMesList.length)) * 100;
      this.porcentajeExpedientesANSAnterior = (1 - (this.cantidadsolicitudANSMesAnterior / this.solicitudMesAnteriorList.length)) * 100;
      const {icono: iconoANS, sentiment: sentimentANS, resultado: resultadoANS} =
      this.evaluarProcesos(this.porcentajeExpedientesANS);
      this.iconoANS = iconoANS;
      this.sentimentANS = sentimentANS;

      const {icono: iconoANSPrevious, sentiment: sentimentANSPrevious, resultado: resultadoANSPrevious} =
      this.evaluarProcesos(this.porcentajeExpedientesANSAnterior);
      this.iconoANSPrevious = iconoANSPrevious;
      this.sentimentANSPrevious = sentimentANSPrevious;
      const [variacionANS, colorANS] = this.evaluarVariacion(resultadoANS, resultadoANSPrevious);
      this.iconoANSVariation = variacionANS;
      this.sentimentANSVariation = colorANS;
     // console.log(this.sentimentANS);

     }

     modifiyDashboardList(){
      this.dashboardList.map(dato =>{
        if (dato.Id === Variables.constantes.EstadoEvaluacionRiesgos) {
          this.numeradorCPM = dato.CantidadSolicitudesConcluidas;
        }
      });

      this.dashboardList.map(dato =>{
        if (dato.Id === Variables.constantes.EstadoRegistroCPM) {
          dato.CantidadSolicitudesConcluidas = this.numeradorCPM;
        }
      });
     }
     countReproccess(listaSeguimiento: TipoProductoModel[]){
      let contadorReprocesos = 0;
      listaSeguimiento.forEach(soliSeguimiento => {
        if (soliSeguimiento.EstadoId === Variables.constantes.EstadoObservadoCPM ||
            soliSeguimiento.EstadoId === Variables.constantes.EstadoObservadoRiesgos ) {
            // console.log(soliSeguimiento);
            contadorReprocesos++;
        }
    });
      return contadorReprocesos;
     }
     countRequestConcluded(listaSolicitudes: SolicitudCreditoHipotecario[]){
      let contadorSolicitudesConcluidas = 0;
      listaSolicitudes.forEach(soliSeguimiento => {
        if (soliSeguimiento.EstadoId === Variables.constantes.EstadoAprobadoConVerificacion ||
            soliSeguimiento.EstadoId === Variables.constantes.EstadoAprobadoSinVerificacion ) {
              contadorSolicitudesConcluidas++;
        }
    });
      return contadorSolicitudesConcluidas;
     }

     evaluarProcesos(porcentaje: number){
      let sentiment = '';
      let icono = '';
      let resultado = 0;
      if (porcentaje >= 50) {
        sentiment = 'happy';
        icono = 'sentiment_satisfied_alt';
        resultado = 2;
      } else if (porcentaje >= 40 && porcentaje < 50) {
        sentiment = 'dissatisfied';
        icono = 'mood_bad';
        resultado = 1;
      }else if (porcentaje < 40){
        sentiment = 'sad';
        icono = 'sentiment_dissatisfied';
        resultado = 0;
      }
      return {icono, sentiment, resultado};
    }
    evaluarReProcesos(porcentaje: number){
      let sentiment = '';
      let icono = '';
      let resultado = 0;
      if (porcentaje >= 50) {
       sentiment = 'sad';
       icono = 'sentiment_dissatisfied';
       resultado = 0;
      } else if (porcentaje >= 40 && porcentaje < 50) {
        sentiment = 'dissatisfied';
        icono = 'mood_bad';
        resultado = 1;
      }else if (porcentaje < 40){
        sentiment = 'happy';
        icono = 'sentiment_satisfied_alt';
        resultado = 2;
      }
      return {icono, sentiment, resultado};
    }

    evaluarVariacion(valor: number, valorAnterior: number){
     let variacion = '';
     let colorVariacion = '';
     if (valor > valorAnterior) {
       variacion = 'trending_up';
       colorVariacion = 'happy';
     } else if ( valor < valorAnterior) {
       variacion = 'trending_down';
       colorVariacion = 'sad';
     }else if (valor === valorAnterior){
       variacion = 'trending_flat';
       colorVariacion = 'dissatisfied';
     }
     return [variacion, colorVariacion];
    }

    evaluarVariacionReprocesos(valor: number, valorAnterior: number){
     let variacion = '';
     let colorVariacion = '';
     if (valor > valorAnterior) {
      variacion = 'trending_up';
      colorVariacion = 'happy';
     } else if ( valor < valorAnterior) {
      variacion = 'trending_down';
      colorVariacion = 'sad';
     }else if (valor === valorAnterior){
       variacion = 'trending_flat';
       colorVariacion = 'dissatisfied';
     }
     return [variacion, colorVariacion];
    }

     getANSList(solicitudes: SolicitudCreditoHipotecario[], estado: EstadoModel, solicitudANS: SolicitudCreditoHipotecario[]){
      if (solicitudes.length !== 0){
        const fechaActual = moment();
        let fueraANS = 0;
        solicitudes.forEach(solicitud => {
          // console.log(solicitud);
          let ansRenta = 0;
          let ansRentaMixta = 0;
          let esRentaMixta = false;
          if (solicitud.EstadoId === Variables.constantes.EstadoEvaluacionRiesgos) {
            if (solicitud.Tipo_RentaId.length > 2) {
              esRentaMixta = true;
            } else {
              esRentaMixta = false;
            }
            if (esRentaMixta) {
              if (solicitud.Tipo_RentaId.find(val => val === 3)) {
                ansRentaMixta = estado.ANS_Renta_3;
              } else {
                ansRentaMixta = estado.ANS_Mixta;
              }
            }
            solicitud.Tipo_RentaId.forEach((tipoRenta) => {
              switch (tipoRenta) {
                case Variables.constantes.TipoRenta1eraCategoria:
                  ansRenta += estado.ANS_Renta_1;
                  break;
                case Variables.constantes.TipoRenta2daCategoria:
                  ansRenta += estado.ANS_Renta_2;
                  break;
                case Variables.constantes.TipoRenta3eraCategoria:
                  ansRenta += estado.ANS_Renta_3;
                  break;
                case Variables.constantes.TipoRenta4taCategoria:
                  ansRenta += estado.ANS_Renta_4;
                  break;
                case Variables.constantes.TipoRenta5taCategoria:
                  ansRenta += estado.ANS_Renta_5;
                  break;
                default:
                  break;
              }
          });
            if (solicitud.Fecha_Estado !== null) {
            const AnsRenta = ansRenta + ansRentaMixta + estado.Valor_ANS;
            const fechaEstado = moment(solicitud.Fecha_Estado);
            const tiempoPromedioEstacion = this.calcBusinessDays(fechaEstado, fechaActual);
            if (tiempoPromedioEstacion > AnsRenta) {
              fueraANS++;
              solicitudANS.push(solicitud);
            }

            }
          } else {
            if (solicitud.Fecha_Estado !== null) {
              const fechaEstado = moment(solicitud.Fecha_Estado);
              const tiempoPromedioEstacion = this.calcBusinessDays(fechaEstado, fechaActual);
              if (tiempoPromedioEstacion > estado.Valor_ANS) {
                fueraANS++;
                // this.solicitudANSList.push(solicitudes[contador]);
                solicitudANS.push(solicitud);
              }
              // tiempo += tiempoPromedioEstacion;
              // tiempoPromedio = tiempo / solicitudes.length;
            }
          }
        });
        // console.log(fueraANS);
        // console.log(this.solicitudANSList);
      }
     }

     listenerZona(){
      this.hipotecarioForm.controls.ZonaId.valueChanges.subscribe(zona => {
        if (zona !== Variables.constantes.ZonaIDFFVV) {
          this.hipotecarioForm.controls.Canal.setValue(2);
        } else {
          this.hipotecarioForm.controls.Canal.setValue(1);
        }
        // const mes = this.hipotecarioForm.controls.MesId.value;
        // this.toListSolicitudes(mes, zona);
      });
     }

     listenerMonth(){
      this.hipotecarioForm.controls.MesId.valueChanges.subscribe(mes => {
        // this.toListSolicitudes(mes, 0);
      });
     }

     listIndicators(){
       let mes = this.hipotecarioForm.controls.MesId.value;
       let zona = this.hipotecarioForm.controls.ZonaId.value;
       let oficina = this.hipotecarioForm.controls.OficinaId.value;
       let autor = this.hipotecarioForm.controls.Vendedor.value;
       if (mes === null) {
         mes = 0;
       }
       if (zona === null) {
        zona = 0;
       }
       if (oficina === null) {
        oficina = 0;
       }
       if (autor === null) {
        autor = 0;
       }
       this.toListSolicitudes(mes, zona, oficina, autor);
       this.showIndicadores = true;
     }

     async toListSolicitudes(mes= 0 , idZona = 0, idOficina = 0, autor = 0 ){
       try {
         const year = this.hipotecarioForm.controls.Year.value;
         this.showLoading();
         this.solicitudHipotecarioList = await this.getSolicitudes(idZona, idOficina, autor);
         await this.getFlujoSeguimiento(mes, year);
         this.getMonthRequest(mes);
         this.calculateIndicators();
         this.hideLoading();
       } catch (error) {
         console.log(error);
         this.showErrorMessage('Intente Nuevamente');
       }
      // console.log(this.solicitudHipotecarioList);
     }

     async getSolicitudes(idZona = 0, idOficina = 0, idAuthor = 0 ) {
      let data: SolicitudCreditoHipotecario[];
      const fieldsFilter: string[] = [];
      const valuesFilter: any[] = [];
      // debugger;
      if (idZona !== 0) {
        fieldsFilter.push('ZonaId');
        valuesFilter.push(idZona);
      }
      if (idOficina !== 0) {
        fieldsFilter.push('OficinaId');
        valuesFilter.push(idOficina);
      }

      if (idAuthor !== 0) {
        fieldsFilter.push('AuthorId');
        valuesFilter.push(idAuthor);
      }
      if (fieldsFilter.length === 0) {data = await this.solicitudService.getDashboard()
          .then(
            (solicitudHipotecarioList) => (this.solicitudHipotecarioList = solicitudHipotecarioList))
          .catch((error) => console.error(error));
      } else {
        data = await this.solicitudService.getDashboardByFields(fieldsFilter, valuesFilter)
          .then(
            (solicitudHipotecarioList) => (this.solicitudHipotecarioList = solicitudHipotecarioList))
          .catch((error) => console.error(error));
      }
      console.log(data);
      return data;
    }

    async getFlujoSeguimiento(mes: number, year: number) {
      await this.solicitudService
        .getSolicitudSeguimiento(Variables.listas.FlujoSeguimientoEtapa, mes, year)
        .then((flujoSeguimientoEtapaLista: any) => (this.flujoSeguimientoEtapaLista = flujoSeguimientoEtapaLista))
        .catch((error) => console.error(error));
    }
    getOficina(): any {
      this.generalListService
        .get(Variables.listas.AdmOficina, 'Title')
        .then((oficinaList: any) => (this.oficinaList = oficinaList))
        .catch((error) => console.error(error));
    }

    async getEstado() {
      let estados: EstadoModel[];
      estados = await this.generalListService
        .get(Variables.listas.AdmEstado)
        .then((estadoList) => estadoList)
        .catch((error) => console.error(error));
      const estadosActivos = estados.filter((item) => item.Activo === true);
      return estadosActivos;
    }

    getZona() {
      this.generalListService
        .get(Variables.listas.AdmZona)
        .then((zonaModelList) => (this.zonaModelList = zonaModelList))
        .catch((error) => console.error(error));
    }

     getYears(){
     const yearDate = (new Date()).getFullYear();
     let i = 0;
     this.YEARS = [];
     for (let index = yearDate; index > 1900; index--) {
       const year = { id: i, year: index };
       this.YEARS.push(year);
       i++;
     }
     // console.log(this.YEARS);
  }

  async getEjecutivo() {
    this.usersList = [];
    this.usersList = await this.userService.getUsuariosPorGrupo(Variables.listas.AdmEjecutivos)
     .then((user) => user);
    // console.log(this.usersList);
  }
  showItems(){
    this.showIndicadores = !this.showIndicadores;
    this.showDetalleConcluidos = !this.showDetalleConcluidos;
    this.showDetalleANS = !this.showDetalleANS;
    this.showDetalleReprocesos = !this.showDetalleReprocesos;

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

 //  evaluateRequestConcluded(expedientesConcluidos: number, happy: string, normal: string, sad: string ){
    //   let resultado = 0;
    //   if (expedientesConcluidos >= 50) {
    //     document.getElementById(happy).style.display = 'block';
    //     this.hideIcon([normal, sad]);
    //     resultado = 2;
    //   } else if ( expedientesConcluidos >= 40  && expedientesConcluidos < 50) {
    //     document.getElementById(normal).style.display = 'block';
    //     this.hideIcon([happy, sad]);
    //     resultado = 1;
    //   }else if (expedientesConcluidos < 40){
    //     document.getElementById(sad).style.display = 'block';
    //     this.hideIcon([happy, normal]);
    //     resultado = 0;
    //   }else{
    //     this.hideIcon([sad, normal, happy]);
    //   }
    //   return resultado;
    //  }

    //  evaluateVariation(result: number, resultPrevious: number, happy: string, normal: string, sad: string ){
    //     if (result > resultPrevious) {
    //       document.getElementById(happy).style.display = 'block';
    //       this.hideIcon([normal, sad]);
    //     } else if ( result < resultPrevious) {
    //       document.getElementById(sad).style.display = 'block';
    //       this.hideIcon([normal, happy]);
    //     }else if (result === resultPrevious){
    //       document.getElementById(normal).style.display = 'block';
    //       this.hideIcon([sad, happy]);
    //     }
    //  }

   // hideIcons(){
    //    const elementosHide = ['happyReprocessing', 'dissastisfiedReprocessing',
    //    'sadReprocessing', 'happyReprocessingPrevious', 'dissastisfiedReprocessingPrevious', 'sadReprocessingPrevious',
    //   'happyReprocessingVariation', 'dissastisfiedReprocessingVariation', 'sadReprocessingVariation' ];
    //    this.hideIcon(elementosHide);
    //    }

    // hideIcon(element: string[]){
    //   for (const iterator of element) {
    //     // console.log(iterator);
    //     document.getElementById(iterator).style.display = 'none';
    //   }
    // }
}
