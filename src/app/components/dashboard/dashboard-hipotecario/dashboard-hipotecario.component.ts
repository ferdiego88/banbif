import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {SolicitudCreditoHipotecario, TipoProductoModel, ZonaModel, EstadoModel, DashboardModel} from 'src/app/shared/models/fisics';
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
  flujoSegumientoEtapaList: TipoProductoModel[];
  solicitudFlujoSeguimientoList: TipoProductoModel[];
  estadoList: EstadoModel[];
  dashboard: DashboardModel[];
  tipoProductoList: TipoProductoModel[];
  tipoSubProductoList: TipoProductoModel[];
  solicitudANSList: SolicitudCreditoHipotecario[];
  solicitudANSAcumuladoList: SolicitudCreditoHipotecario[];
  solicitudANSPorEstadoList: SolicitudCreditoHipotecario[];
  solicitudHipotecarioList: SolicitudCreditoHipotecario[];
  solicitudesEstadoList: SolicitudCreditoHipotecario[];
  solicitudPorMesFechaCreacionList: SolicitudCreditoHipotecario[];
  solicitudesPorFechaEstadoList: SolicitudCreditoHipotecario[];
  cantidadSolicitudesPorMes: number;
  cantidadSolicitudesConcluidas: number;
  cantidadSolicitudesReprocesos: number;
  porcentajeExpedientesConcluidos: number;
  porcentajeExpedientesReprocesos: number;
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
  }

  loadListeners(){
    this.listenerMes();
    this.listenerZona();
  }

  getZona() {
    this.generalListService
      .get(Variables.listas.AdmZona)
      .then((zonaModelList) => (this.zonaModelList = zonaModelList))
      .catch((error) => console.error(error));
  }


  hideIcons(){
     document.getElementById('happyConcluded').style.display = 'none';
     document.getElementById('dissastisfiedConcluded').style.display = 'none';
     document.getElementById('sadConcluded').style.display = 'none';
     document.getElementById('happyReprocessing').style.display = 'none';
     document.getElementById('dissastisfiedReprocessing').style.display = 'none';
     document.getElementById('sadReprocessing').style.display = 'none';
     }

     listenerMes(){
      this.hipotecarioForm.controls.MesId.valueChanges.subscribe(mes => {
        const solicitudes = this.solicitudHipotecarioList;
        let solicitudPorMes;
        let solicitudFlujoSeguimiento: TipoProductoModel[];
        this.solicitudPorMesFechaCreacionList = [];
        this.solicitudFlujoSeguimientoList = [];
        solicitudes.forEach(solicitud => {
          const fecha = moment(solicitud.Created).format('DD-MM-YYYY');
          const fechaCreacion = moment(fecha, 'DD-MM-YYYY').toDate();
          const mesCreacion  = fechaCreacion.getMonth();
          // console.log(mesCreacion);
          if (mesCreacion === mes) {
             solicitudPorMes = this.solicitudHipotecarioList.find(item => item.Id === solicitud.Id);
             solicitudFlujoSeguimiento = this.flujoSegumientoEtapaList.filter(item => item.SolicitudHipotecarioId === solicitud.Id);
             solicitudFlujoSeguimiento.forEach( solicitudFlujo => {
               // console.log(solicitudFlujo);
               this.solicitudFlujoSeguimientoList.push(solicitudFlujo);
             });
             this.solicitudPorMesFechaCreacionList.push(solicitudPorMes);
              }
            });

        this.cantidadSolicitudesPorMes = this.solicitudPorMesFechaCreacionList.length;
        let contadorSolicitudesConcluidas = 0;
        let contadorReprocesos = 0;
        // console.log(this.solicitudFlujoSeguimientoList);
        this.solicitudFlujoSeguimientoList.forEach(soliSeguimiento => {
            if (soliSeguimiento.EstadoId === Variables.constantes.EstadoObservadoCPM ||
                soliSeguimiento.EstadoId === Variables.constantes.EstadoObservadoRiesgos ) {
                contadorReprocesos++;
            }
        });
        this.solicitudPorMesFechaCreacionList.forEach(solicitud => {
          if (solicitud.EstadoId === Variables.constantes.EstadoAprobadoConVerificacion
            || solicitud.EstadoId === Variables.constantes.EstadoAprobadoSinVerificacion) {
            contadorSolicitudesConcluidas++;
          }
        });
        console.log(contadorReprocesos);
        this.cantidadSolicitudesConcluidas = contadorSolicitudesConcluidas;
        this.cantidadSolicitudesReprocesos = contadorReprocesos;

        this.porcentajeExpedientesConcluidos = (this.cantidadSolicitudesConcluidas / this.cantidadSolicitudesPorMes) * 100;
        if (this.porcentajeExpedientesConcluidos >= 50) {
          document.getElementById('happyConcluded').style.display = 'block';
          document.getElementById('dissastisfiedConcluded').style.display = 'none';
          document.getElementById('sadConcluded').style.display = 'none';
        } else if ( this.porcentajeExpedientesConcluidos >= 40  && this.porcentajeExpedientesConcluidos < 50) {
          document.getElementById('dissastisfiedConcluded').style.display = 'block';
          document.getElementById('happyConcluded').style.display = 'none';
          document.getElementById('sadConcluded').style.display = 'none';
        }else if (this.porcentajeExpedientesConcluidos < 40){
          document.getElementById('sadConcluded').style.display = 'block';
          document.getElementById('happyConcluded').style.display = 'none';
          document.getElementById('dissastisfiedConcluded').style.display = 'none';
        }else{
          document.getElementById('happyConcluded').style.display = 'none';
          document.getElementById('dissastisfiedConcluded').style.display = 'none';
          document.getElementById('sadConcluded').style.display = 'none';
        }
        this.porcentajeExpedientesReprocesos = (this.cantidadSolicitudesReprocesos / this.cantidadSolicitudesPorMes) * 100;
        if (this.porcentajeExpedientesReprocesos >= 50) {
          document.getElementById('happyReprocessing').style.display = 'none';
          document.getElementById('dissastisfiedReprocessing').style.display = 'none';
          document.getElementById('sadReprocessing').style.display = 'block';
        } else if ( this.porcentajeExpedientesReprocesos >= 40  && this.porcentajeExpedientesReprocesos < 50) {
          document.getElementById('dissastisfiedReprocessing').style.display = 'block';
          document.getElementById('happyReprocessing').style.display = 'none';
          document.getElementById('sadReprocessing').style.display = 'none';
        }else if (this.porcentajeExpedientesReprocesos < 40){
          document.getElementById('sadReprocessing').style.display = 'none';
          document.getElementById('happyReprocessing').style.display = 'block';
          document.getElementById('dissastisfiedReprocessing').style.display = 'none';
        }else{
          document.getElementById('happyReprocessing').style.display = 'none';
          document.getElementById('dissastisfiedReprocessing').style.display = 'none';
          document.getElementById('sadReprocessing').style.display = 'none';
        }

      });
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
        .then((flujoSegumientoEtapaList) => (this.flujoSegumientoEtapaList = flujoSegumientoEtapaList))
        .catch((error) => console.error(error));
    }

}
