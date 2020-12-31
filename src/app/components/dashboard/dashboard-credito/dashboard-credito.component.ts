import { ApplicationRef, Component, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { environment } from 'src/environments/environment';
import {
  SolicitudCreditoHipotecario,
  TipoProductoModel,
  ZonaModel,
  EstadoModel,
  DashboardModel,
} from 'src/app/shared/models/fisics';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';
import { GeneralListService } from 'src/app/shared/services/general-list.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes.service';
import { Variables } from 'src/app/shared/variables';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
// import {default as _rollupMoment} from 'moment';
import * as _moment from 'moment';
import { UserService } from '../../../shared/services/user.service';
const moment = _moment;
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { User } from 'src/app/shared/models/fisics/base/User';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};

export interface Canal {
  name: string;
  id: number;
}
// export interface DetalleSolicitud {
//   Id: number;
//   Created: Date;
//   Nombre_Titular: string;
//   N_Documento: string;
//   Author: string;
//   Tipo_ProductoId: string;
//   Title: string;
//   ZonaId: string;
//   Oficina: string;
//   Mon_Desembolso: string;
//   Desembolso: string;
// }

const CANAL_DATA: Canal[] = [
  { id: 1, name: 'FFVV' },
  { id: 2, name: 'Red de Oficinas' },
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
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DashboardCreditoComponent
  extends FormularioBase
  implements OnInit  {
  displayedColumns: string[] = ['Id', 'Created', 'Nombre_Titular',
  'N_Documento', 'Author', 'Tipo_Producto', 'Estado', 'ZonaId', 'Oficina',
  'Mon_Desembolso', 'Desembolso' ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  data: Canal[] = CANAL_DATA;
  zonaModelList: ZonaModel[];
  usersList: User[];
  oficinaList: TipoProductoModel[];
  estadoList: EstadoModel[];
  dashboard: DashboardModel[];
  tipoProductoList: TipoProductoModel[];
  tipoSubProductoList: TipoProductoModel[];
  solicitudANSList: SolicitudCreditoHipotecario[];
  solicitudANSAcumuladoList: SolicitudCreditoHipotecario[];
  solicitudANSPorEstadoList: SolicitudCreditoHipotecario[];
  solicitudHipotecarioList: SolicitudCreditoHipotecario[];
  flujoSeguimientoList: SolicitudCreditoHipotecario[];
  solicitudesEstadoList: SolicitudCreditoHipotecario[];

  totalExpedientes = 0;
  totalTiempoPromedioEstacion = 0;
  totalTiempoPromedioTotal = 0;
  totalMonto = 0;
  totalFueraANS = 0;
  totalfueraANSAcumulado = 0;
  showSolicitudes = false;
  dashboardForm = this.fb.group({
    ZonaId: [null],
    OficinaId: [null],
    Fecha_Creacion_Desde: [null],
    Fecha_Creacion_Hasta: [null],
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
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

  ngOnInit() {
    this.cargarCombos();
    this.cargarListeneters();
    this.getEjecutivo();
  }

  cargarCombos() {
    this.getZona();
    this.getEstado();
    this.getOficina();
    this.getTipoProducto();
    this.getTipoSubProducto();
    // this.dashboardForm.controls.Vendedor.disable();
  }

  cargarListeneters() {
    this.listarSolicitudesEstado();
    this.listenerOficina();
    this.listenerTipoProducto();
    this.listenerZona();
    this.listenerTipoSubProducto();
    this.listenerEjecutivo();
    this.listenerFecha();
  }

  getZona() {
    this.generalListService
      .get(Variables.listas.AdmZona)
      .then((zonaModelList) => (this.zonaModelList = zonaModelList))
      .catch((error) => console.error(error));
  }

  async getEjecutivo() {
    this.usersList = [];
    this.usersList = await this.userService.getUsuariosPorGrupo(Variables.listas.AdmEjecutivos)
     .then((user) => user);
    // console.log(this.usersList);
  }
  getOficina(): any {
    this.generalListService
      .get(Variables.listas.AdmOficina, 'Title')
      .then((oficinaList: any) => (this.oficinaList = oficinaList))
      .catch((error) => console.error(error));
  }
  getTipoProducto() {
    this.generalListService
      .get(Variables.listas.AdmTipoProducto, 'Title')
      .then((tipoProductoList) => (this.tipoProductoList = tipoProductoList))
      .catch((error) => console.error(error));
  }
  getTipoSubProducto() {
    this.generalListService
      .get(Variables.listas.AdmTipoSubProducto, 'Title')
      .then(
        (tipoSubProductoList) =>
          (this.tipoSubProductoList = tipoSubProductoList)
      )
      .catch((error) => console.error(error));
  }

  async getSolicitudes(idZona = 0, idOficina = 0, idTipoProducto = 0, idTipoSubProducto = 0, idEstado = 0, idAuthor = 0) {
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
    if (idTipoSubProducto !== 0) {
      fieldsFilter.push('Sub_ProductoId');
      valuesFilter.push(idTipoSubProducto);
    }

    if (idEstado !== 0) {
      fieldsFilter.push('EstadoId');
      valuesFilter.push(idEstado);
    }

    if (idAuthor !== 0) {
      fieldsFilter.push('AuthorId');
      valuesFilter.push(idAuthor);
    }

    if (fieldsFilter.length === 0) {
      data = await this.solicitudService
        .get()
        .then(
          (solicitudHipotecarioList) =>
            (this.solicitudHipotecarioList = solicitudHipotecarioList)
        )
        .catch((error) => console.error(error));
    } else {
      data = await this.solicitudService
        .getByFields(fieldsFilter, valuesFilter)
        .then(
          (solicitudHipotecarioList) =>
            (this.solicitudHipotecarioList = solicitudHipotecarioList)
        )
        .catch((error) => console.error(error));
    }
    // console.log(data);
    return data;
  }
  filtraSolicitudes(estado: number) {
    const solicitudes = this.solicitudHipotecarioList.filter( (item) => item.EstadoId === estado);
    return solicitudes;
  }

  listenerCombosUnselected(
    control1: string,
    control2: string,
    control3: string
  ) {
    this.dashboardForm.get(`${control1}`).setValue(null);
    this.dashboardForm.get(`${control2}`).setValue(null);
    this.dashboardForm.get(`${control3}`).setValue(null);
  }

  listenerZona() {
    this.dashboardForm.controls.ZonaId.valueChanges.subscribe((value) => {
      if (value !== Variables.constantes.ZonaIDFFVV) {
        this.dashboardForm.controls.Canal.setValue(2);
      } else {
        this.dashboardForm.controls.Canal.setValue(1);
      }
      if (value) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(value, 0, 0, 0, 0, 0);
      } else if (value !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado();
      }
    });
  }

  listenerEjecutivo() {
    this.dashboardForm.controls.Vendedor.valueChanges.subscribe((value) => {
      // console.log(value);
      if (value) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(0, 0, 0, 0, 0, value);
      } else if (value !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado();
      }
    });
  }
  listenerFecha() {
    this.dashboardForm.controls.Fecha_Creacion_Desde.valueChanges.subscribe((value) => {
      // let date = new Date();
      console.log(value);
      // if (value) {
      //   this.showSolicitudes = false;
      //   this.listarSolicitudesEstado(0, 0, 0, 0, 0, value);
      // } else if (value !== null) {
      //   this.showSolicitudes = false;
      //   this.listarSolicitudesEstado();
      // }
    });
  }

  listenerOficina() {
    this.dashboardForm.controls.OficinaId.valueChanges.subscribe((value) => {
      // console.log(value);
      if (value) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(0, value, 0, 0, 0, 0);
      } else if (value !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado();
        this.dashboardForm.controls.Canal.setValue('Todas');
      }
    });
  }

  listenerTipoProducto() {
    this.dashboardForm.controls.Tipo_ProductoId.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(0, 0, value, 0, 0, 0);
        } else if (value !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado();
        }
      }
    );
  }
  listenerTipoSubProducto() {
    this.dashboardForm.controls.Sub_ProductoId.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(0, 0, 0, value, 0, 0);
        } else if (value !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado();
        }
      }
    );
  }
  async listarSolicitudesEstado(idZona = 0, idOficina = 0, idTipoProducto = 0, idTipoSubProducto = 0, idEstado = 0 , idAuthor = 0) {
    this.showLoading();
    const estados = await this.getEstado();

    this.solicitudHipotecarioList = await this.getSolicitudes(idZona, idOficina, idTipoProducto, idTipoSubProducto, idEstado, idAuthor);
    // console.log(this.solicitudHipotecarioList);
    this.dashboard = [];
    this.totalExpedientes = 0;
    this.totalTiempoPromedioEstacion = 0;
    this.totalTiempoPromedioTotal = 0;
    this.totalMonto = 0;
    this.totalFueraANS = 0;
    this.solicitudANSList = [];
    this.solicitudANSAcumuladoList = [];
    await estados.forEach(async (estado) => {
      // const solicitudes = await this.getSolicitudes(idOficina, idTipoProducto, estado.Id);
      const solicitudes = this.filtraSolicitudes(estado.Id);
      if (solicitudes.length !== 0) {
        let suma = 0,
          tiempo = 0,
          tiempoT = 0,
          tiempoPromedio = 0,
          tiempoPromedioTotal = 0;
        const fechaActual = moment();
        let fueraANS = 0;
        let fueraANSAcumulado = 0;
        let contador = 0;
        solicitudes.forEach((solicitud) => {
        let ansRenta = 0;
        let ansRentaMixta = 0;
        let esRentaMixta = false;

        if (solicitud.EstadoId === Variables.constantes.EstadoEvaluacionRiesgos) {
            // console.log(solicitud.Tipo_RentaId.length);
            if (solicitud.Tipo_RentaId.length > 2) {
             esRentaMixta = true;
            } else {
              esRentaMixta = false;
            }
            if (esRentaMixta){
              if (solicitud.Tipo_RentaId.find(val => val === 3)){
                // console.log(solicitud.Id);
                ansRentaMixta = estado.ANS_Mixta_3;
              }else{
                ansRentaMixta = estado.ANS_Mixta;
              }
            }
            // console.log(solicitud.Tipo_RentaId.find(val => val));
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
              // console.log(ansRentaMixta);
              const AnsRenta = ansRenta + ansRentaMixta + estado.Valor_ANS;
              const fechaEstado = moment(solicitud.Fecha_Estado);
              const tiempoPromedioEstacion = this.calcBusinessDays(fechaEstado,fechaActual);
              if (tiempoPromedioEstacion > AnsRenta) {
                fueraANS++;
                this.solicitudANSList.push(solicitudes[contador]);
              }
              tiempo += tiempoPromedioEstacion;
              tiempoPromedio = tiempo / solicitudes.length;
            }
            if (solicitud.Created !== null) {
              const AnsRentaAcum = ansRenta + ansRentaMixta + estado.ValorANS_Acumulado;
              const fechaCreacion = moment(solicitud.Created);
              const tiempoPromedioT = this.calcBusinessDays(fechaCreacion, fechaActual);
              // tiempoT += fechaActual.diff(fechaCreacion, 'days');
              if (tiempoPromedioT > AnsRentaAcum) {
                fueraANSAcumulado++;
                this.solicitudANSAcumuladoList.push(solicitudes[contador]);
              }
              tiempoT += tiempoPromedioT;
              tiempoPromedioTotal = tiempoT / solicitudes.length;
            }

          }else{
            if (solicitud.Fecha_Estado !== null) {
              const fechaEstado = moment(solicitud.Fecha_Estado);
              const tiempoPromedioEstacion = this.calcBusinessDays(fechaEstado,fechaActual);
              if (tiempoPromedioEstacion > estado.Valor_ANS) {
                fueraANS++;
                this.solicitudANSList.push(solicitudes[contador]);
              }
              tiempo += tiempoPromedioEstacion;
              tiempoPromedio = tiempo / solicitudes.length;
            }

            if (solicitud.Created !== null) {
              const fechaCreacion = moment(solicitud.Created);
              const tiempoPromedioT = this.calcBusinessDays(fechaCreacion,fechaActual);
              // tiempoT += fechaActual.diff(fechaCreacion, 'days');
              if (tiempoPromedioT > estado.ValorANS_Acumulado) {
                fueraANSAcumulado++;
                this.solicitudANSAcumuladoList.push(solicitudes[contador]);
              }
              tiempoT += tiempoPromedioT;
              tiempoPromedioTotal = tiempoT / solicitudes.length;
            }
          }
        contador++;
        solicitud.Precio_Venta && solicitud.Precio_Venta !== 0 && (suma += solicitud.Precio_Venta);
        });

        const dashBoardElement = {
          Id: estado.Id,
          Title: estado.Title,
          Cantidad: solicitudes.length,
          TiempoPromedio: tiempoPromedio,
          TiempoPromedioTotal: tiempoPromedioTotal,
          FueraANS: fueraANS,
          Monto: suma,
          FueraANSAcumulado: fueraANSAcumulado,
        };

        this.dashboard.push(dashBoardElement);
      }
    });

    for (const totales of this.dashboard) {
      this.totalExpedientes += totales.Cantidad;
      this.totalTiempoPromedioEstacion += totales.TiempoPromedio;
      this.totalTiempoPromedioTotal += totales.TiempoPromedioTotal;
      this.totalMonto += totales.Monto;
      this.totalFueraANS += totales.FueraANS;
      this.totalfueraANSAcumulado += totales.FueraANSAcumulado;
    }

    this.hideLoading();
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

  getSolicitudesPorEstado(estadoId: number, element: HTMLElement) {
    const solicitudes = this.filtraSolicitudes(estadoId);
    this.solicitudesEstadoList = solicitudes;
    this.dataSource = new MatTableDataSource<any>(this.solicitudesEstadoList);
    this.showSolicitudes = true;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    setTimeout(() =>{
      this.scroll(element);
    },1000);
  }

  getSolicitudesANS(cantidadSolicitudesANS: number, estadoId?: number, element?: HTMLElement) {
    let solicitudes;
    if (estadoId) {
      solicitudes = this.solicitudANSList.filter(
        (item) => item.EstadoId === estadoId
      );
    } else {
      solicitudes = this.solicitudANSList.slice(0, cantidadSolicitudesANS);
    }
    this.solicitudesEstadoList = solicitudes;
    this.dataSource = new MatTableDataSource<any>(this.solicitudesEstadoList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.showSolicitudes = true;
    setTimeout(() =>{
      this.scroll(element);
    }, 1000);
  }

  getSolicitudesANSAcumulado(
    cantidadSolicitudesANS: number,
    estadoId?: number, element?: HTMLElement
  ) {
    let solicitudes;
    if (estadoId) {
      solicitudes = this.solicitudANSAcumuladoList.filter(
        (item) => item.EstadoId === estadoId
      );
    } else {
      solicitudes = this.solicitudANSAcumuladoList.slice(
        0,
        cantidadSolicitudesANS
      );
    }
    this.solicitudesEstadoList = solicitudes;
    this.dataSource = new MatTableDataSource<any>(this.solicitudesEstadoList);
    this.dataSource.paginator = this.paginator;
    this.showSolicitudes = true;
    this.dataSource.sort = this.sort;
    setTimeout(() =>{
      this.scroll(element);
    }, 1000);

  }

  public irPaginaSolicitud(
    elemento: any
  ) {
      const url = environment.getRutaBaseApp() + '/hipotecario/solicitud/' + elemento.Id;
      window.open(url, '_blank');
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
  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
