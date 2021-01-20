import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {SolicitudCreditoHipotecario, TipoProductoModel, ZonaModel, EstadoModel, DashboardHipotecarioModel} from 'src/app/shared/models/fisics';
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

@Component({
  selector: 'app-dashboard-hipotecario',
  templateUrl: './dashboard-hipotecario.component.html',
  styleUrls: ['./dashboard-hipotecario.component.scss'],
})

export class DashboardHipotecarioComponent extends FormularioBase implements OnInit {
  data: Meses[] = MESES_DATA;
  showSubItems = false;
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

  cantidadSolicitudesPorMesAnterior: number;
  cantidadSolicitudesConcluidasAnterior: number;
  cantidadSolicitudesReprocesosAnterior: number;
  porcentajeExpedientesConcluidosAnterior: number;
  porcentajeExpedientesReprocesosAnterior: number;

  solicitudANSList: SolicitudCreditoHipotecario[];
  solicitudANSAnteriorList: SolicitudCreditoHipotecario[];

  showDetalleConcluidos = false;
  showDetalleReprocesos = false;
  showDetalleANS = false;
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
    this.loadCombos();
    this.loadListeners();
    this.toListSolicitudes();
    this.hideIcons();
  }

  loadCombos(){
    this.getZona();
    this.getFlujoSeguimiento();
    this.getOficina();
    // this.getEstado();
  }

  loadListeners(){
    this.listenerMonth();
    this.listenerZona();
  }

  getZona() {
    this.generalListService
      .get(Variables.listas.AdmZona)
      .then((zonaModelList) => (this.zonaModelList = zonaModelList))
      .catch((error) => console.error(error));
  }


  hideIcons(){
     const elementosHide = ['happyConcluded', 'dissastisfiedConcluded', 'sadConcluded', 'happyConcludedPrevious',
     'dissastisfiedConcludedPrevious', 'sadConcludedPrevious', 'happyConcludedVariation', 'dissastisfiedConcludedVariation',
     'sadConcludedVariation', 'happyReprocessing', 'dissastisfiedReprocessing',
     'sadReprocessing', 'happyReprocessingPrevious', 'dissastisfiedReprocessingPrevious', 'sadReprocessingPrevious',
    'happyReprocessingVariation', 'dissastisfiedReprocessingVariation', 'sadReprocessingVariation' ];
     this.hideIcon(elementosHide);
     }

  hideIcon(element: string[]){
    for (const iterator of element) {
      // console.log(iterator);
      document.getElementById(iterator).style.display = 'none';
    }
  }

     getMonthRequest(mes: number){
      const solicitudes = this.solicitudHipotecarioList;
      let solicitudPorMes: SolicitudCreditoHipotecario;
      let solicitudFlujoSeguimiento: TipoProductoModel[];
      let solicitudPorMesAnterior: SolicitudCreditoHipotecario;
      let solicitudFlujoSeguimientoAnterior: TipoProductoModel[];
      this.solicitudMesList = [];
      this.flujoSeguimientoList = [];
      this.solicitudMesAnteriorList = [];
      this.flujoSeguimientoAnteriorList = [];

      let mesAnterior: number;
      if (mes === 0) {
        mesAnterior = 11;
      } else {
        mesAnterior = mes - 1;
      }
      // console.log(mesAnterior);
      solicitudes.forEach(solicitud => {
          const fecha = moment(solicitud.Created).format('DD-MM-YYYY');
          const fechaCreacion = moment(fecha, 'DD-MM-YYYY').toDate();
          const mesCreacion  = fechaCreacion.getMonth();
          if (mesCreacion === mes) {
            solicitudFlujoSeguimiento = this.flujoSeguimientoEtapaLista.filter(item => item.SolicitudHipotecarioId === solicitud.Id);
            solicitudFlujoSeguimiento.forEach( solicitudFlujo => {
              this.flujoSeguimientoList.push(solicitudFlujo);
            });
            solicitudPorMes = this.solicitudHipotecarioList.find(item => item.Id === solicitud.Id);
            this.solicitudMesList.push(solicitudPorMes);
             }
          if (mesCreacion === mesAnterior) {
            solicitudPorMesAnterior = this.solicitudHipotecarioList.find(item => item.Id === solicitud.Id);
            solicitudFlujoSeguimientoAnterior =
            this.flujoSeguimientoEtapaLista.filter(item => item.SolicitudHipotecarioId === solicitud.Id);
            solicitudFlujoSeguimientoAnterior.forEach( solicitudFlujo => {
              this.flujoSeguimientoAnteriorList.push(solicitudFlujo);
            });
            this.solicitudMesAnteriorList.push(solicitudPorMesAnterior);
             }
      });
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
     evaluateRequestConcluded(expedientesConcluidos: number, happy: string, normal: string, sad: string ){
      let resultado = 0;
      if (expedientesConcluidos >= 50) {
        document.getElementById(happy).style.display = 'block';
        this.hideIcon([normal, sad]);
        resultado = 2;
      } else if ( expedientesConcluidos >= 40  && expedientesConcluidos < 50) {
        document.getElementById(normal).style.display = 'block';
        this.hideIcon([happy, sad]);
        resultado = 1;
      }else if (expedientesConcluidos < 40){
        document.getElementById(sad).style.display = 'block';
        this.hideIcon([happy, normal]);
        resultado = 0;
      }else{
        this.hideIcon([sad, normal, happy]);
      }
      return resultado;
     }

     evaluateVariation(result: number, resultPrevious: number, happy: string, normal: string, sad: string ){
        if (result > resultPrevious) {
          document.getElementById(happy).style.display = 'block';
          this.hideIcon([normal, sad]);
        } else if ( result < resultPrevious) {
          document.getElementById(sad).style.display = 'block';
          this.hideIcon([normal, happy]);
        }else if (result === resultPrevious){
          document.getElementById(normal).style.display = 'block';
          this.hideIcon([sad, happy]);
        }
     }
     evaluateReprocess(reprocesos: number, happy: string, normal: string, sad: string ){
      let resultado = 0;
      if (reprocesos >= 50) {
        this.hideIcon([happy, normal]);
        document.getElementById(sad).style.display = 'block';
        resultado = 0;
      } else if ( reprocesos >= 40  && reprocesos < 50) {
        document.getElementById(normal).style.display = 'block';
        this.hideIcon([happy, sad]);
        resultado = 1;
      }else if (reprocesos < 40){
        document.getElementById(happy).style.display = 'block';
        this.hideIcon([sad, normal]);
        resultado = 2;
      }else{
        this.hideIcon([sad, normal, happy]);
      }
      return resultado;
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
     listenerMonth(){
      this.hipotecarioForm.controls.MesId.valueChanges.subscribe(mes => {
         this.getMonthRequest(mes);
         this.filterSolicitudesEstado();
         // console.log(this.solicitudMesList);
         this.cantidadSolicitudesPorMes = this.solicitudMesList.length;
         this.cantidadSolicitudesPorMesAnterior = this.solicitudMesAnteriorList.length;

         this.cantidadSolicitudesConcluidas = this.countRequestConcluded(this.solicitudMesList);
         this.cantidadSolicitudesReprocesos = this.countReproccess(this.flujoSeguimientoList);

         this.cantidadSolicitudesConcluidasAnterior = this.countRequestConcluded(this.solicitudMesAnteriorList);
         this.cantidadSolicitudesReprocesosAnterior = this.countReproccess(this.flujoSeguimientoAnteriorList);

         this.porcentajeExpedientesConcluidos = (this.cantidadSolicitudesConcluidas / this.cantidadSolicitudesPorMes) * 100;
         this.porcentajeExpedientesReprocesos = (this.cantidadSolicitudesReprocesos / this.cantidadSolicitudesPorMes) * 100;

         this.porcentajeExpedientesConcluidosAnterior =
         (this.cantidadSolicitudesConcluidasAnterior / this.cantidadSolicitudesPorMesAnterior) * 100;
         this.porcentajeExpedientesReprocesosAnterior =
         (this.cantidadSolicitudesReprocesosAnterior / this.cantidadSolicitudesPorMesAnterior) * 100;

         const resultEvaluation =
         this.evaluateRequestConcluded(this.porcentajeExpedientesConcluidos, 'happyConcluded', 'dissastisfiedConcluded', 'sadConcluded');
         const resultEvaluationPrevious =
         this.evaluateRequestConcluded(this.porcentajeExpedientesConcluidosAnterior, 'happyConcludedPrevious', 'dissastisfiedConcludedPrevious', 'sadConcludedPrevious');
         const resultProcess =
         this.evaluateReprocess(this.porcentajeExpedientesReprocesos, 'happyReprocessing', 'dissastisfiedReprocessing', 'sadReprocessing');
         const resultProcessPrevious =
         this.evaluateReprocess(this.porcentajeExpedientesReprocesosAnterior, 'happyReprocessingPrevious', 'dissastisfiedReprocessingPrevious', 'sadReprocessingPrevious');

         this.evaluateVariation(resultProcess, resultProcessPrevious, 'happyReprocessingVariation', 'dissastisfiedReprocessingVariation', 'sadReprocessingVariation');
         this.evaluateVariation(resultEvaluation, resultEvaluationPrevious, 'happyConcludedVariation', 'dissastisfiedConcludedVariation', 'sadConcludedVariation');
      });
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
      estados.forEach(estado => {
        this.solicitudANSList = [];
        this.solicitudANSAnteriorList = [];
        let porcentajeExpediente = 0;
        let porcentajeExpedienteAnterior = 0;
        this.solicitudesEstadoList = this.solicitudMesList.filter(solicitud => solicitud.EstadoId === estado.Id);
        this.getANSList(this.solicitudesEstadoList, estado, this.solicitudANSList);
        console.log(this.solicitudANSList);
        this.flujoSeguimientoEstadoList = this.flujoSeguimientoList.filter(flujosolicitud => flujosolicitud.EstadoId === estado.Id);
        this.solicitudesEstadoAnteriorList = this.solicitudMesAnteriorList.filter(solicitud => solicitud.EstadoId === estado.Id);
        this.getANSList(this.solicitudesEstadoAnteriorList, estado, this.solicitudANSAnteriorList);
        console.log(this.solicitudANSAnteriorList);
        this.flujoSeguimientoEstadoAnteriorList =
        this.flujoSeguimientoAnteriorList.filter(flujosolicitud => flujosolicitud.EstadoId === estado.Id);
        const solicitudes = this.solicitudesEstadoList.length;
        const flujoSeguimiento = this.flujoSeguimientoEstadoList.length;
        const solicitudesAnterior = this.solicitudesEstadoAnteriorList.length;
        const flujoSeguimientoAnterior = this.flujoSeguimientoEstadoAnteriorList.length;
        const cantidadSolicitudANS = this.solicitudANSList.length;
        const cantidadSolicitudANSAnterior = this.solicitudANSAnteriorList.length;
        const porcentajeANS = (1 - (cantidadSolicitudANS / solicitudes)) * 100;
        const porcentajeANSANterior = (1 - (cantidadSolicitudANSAnterior / solicitudesAnterior)) * 100;
        /// const reprocesos = this.countReproccess(this.flujoSeguimientoEstadoList);
        // console.log(reprocesos);
        if (solicitudes > flujoSeguimiento) {
          // porcentajeExpediente = 0;
          porcentajeExpediente = (100 - (solicitudes / this.solicitudMesList.length) * 100);
        } else {
          porcentajeExpediente = ((flujoSeguimiento - solicitudes) / flujoSeguimiento) * 100;
        }
        if (solicitudesAnterior){
          if (solicitudesAnterior > flujoSeguimientoAnterior) {
            // porcentajeExpediente = 0;
            porcentajeExpedienteAnterior = 100 - (solicitudesAnterior / this.solicitudMesAnteriorList.length) * 100;
          } else {
            porcentajeExpedienteAnterior = ((flujoSeguimientoAnterior - solicitudesAnterior) / flujoSeguimientoAnterior) * 100;
          }
        }
        const {icono, sentiment, resultado} = this.evaluarProcesos(porcentajeExpediente);
        const {icono: iconoPrevious, sentiment: sentimentPrevious, resultado: resultadoPrevious} =
        this.evaluarProcesos(porcentajeExpedienteAnterior);
        const [variacionConcluidos, colorVariacion] = this.evaluarVariacion(resultado, resultadoPrevious);
        // console.log(this.sentiment);
        const estadoElement = {
          Id: estado.Id,
          Title: estado.Title,
          CantidadSolicitudes: solicitudes,
          CantidadSolicitudesANS: cantidadSolicitudANS,
          CantidadSolicitudesANSAnterior: cantidadSolicitudANSAnterior,
          FlujoSeguimiento: flujoSeguimiento,
          Porcentaje: porcentajeExpediente,
          PorcentajeAnterior: porcentajeExpedienteAnterior,
          PorcentajeANS: porcentajeANS,
          PorcentajeANSAnterior: porcentajeANSANterior,
          Icono: icono,
          Sentimiento: sentiment,
          IconoAnterior: iconoPrevious,
          SentimientoAnterior: sentimentPrevious,
          Variacion: variacionConcluidos,
          ColorVariacion: colorVariacion
        };
        // console.log(estadoElement);
        // this.dashboardList.push(estadoElement);
        if (estado.Id === Variables.constantes.EstadoObservadoCPM || estado.Id === Variables.constantes.EstadoObservadoRiesgos) {
          this.dashboardReprocesosList.push(estadoElement);
        } else {
          if (solicitudes > 0) {
            this.dashboardList.push(estadoElement);
           }
        }

          });
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
        this.toListSolicitudes(zona);
      });
     }

     async toListSolicitudes(idZona = 0){
      this.showLoading();
      this.solicitudHipotecarioList = await this.getSolicitudes(idZona);
      this.hideLoading();
      // console.log(this.solicitudHipotecarioList);
     }

     async getSolicitudes(idZona = 0) {
      let data: SolicitudCreditoHipotecario[];
      const fieldsFilter: string[] = [];
      const valuesFilter: any[] = [];

      // if (idMes !== 0) {
      //   fieldsFilter.push('MesSolicitud');
      //   valuesFilter.push(idMes);
      // }
      if (idZona !== 0) {
        fieldsFilter.push('ZonaId');
        valuesFilter.push(idZona);
      }
      // if (idOficina !== 0) {
      //   fieldsFilter.push('OficinaId');
      //   valuesFilter.push(idOficina);
      // }

      // if (idTipoProducto !== 0) {
      //   fieldsFilter.push('Tipo_ProductoId');
      //   valuesFilter.push(idTipoProducto);
      // }
      // if (idTipoSubProducto !== 0) {
      //   fieldsFilter.push('Sub_ProductoId');
      //   valuesFilter.push(idTipoSubProducto);
      // }

      // if (idEstado !== 0) {
      //   fieldsFilter.push('EstadoId');
      //   valuesFilter.push(idEstado);
      // }

      // if (idAuthor !== 0) {
      //   fieldsFilter.push('AuthorId');
      //   valuesFilter.push(idAuthor);
      // }
      if (fieldsFilter.length === 0) {data = await this.solicitudService.get()
          .then(
            (solicitudHipotecarioList) =>(this.solicitudHipotecarioList = solicitudHipotecarioList))
          .catch((error) => console.error(error));
      } else {
        data = await this.solicitudService.getByFields(fieldsFilter, valuesFilter)
          .then(
            (solicitudHipotecarioList) =>(this.solicitudHipotecarioList = solicitudHipotecarioList))
          .catch((error) => console.error(error));
      }
      // console.log(data);
      return data;
    }

    getFlujoSeguimiento() {
      this.generalListService
        .get(Variables.listas.FlujoSeguimientoEtapa)
        .then((flujoSeguimientoEtapaLista) => (this.flujoSeguimientoEtapaLista = flujoSeguimientoEtapaLista))
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
