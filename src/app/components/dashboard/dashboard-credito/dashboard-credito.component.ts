import { ApplicationRef, Component, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { environment } from 'src/environments/environment';
import { SolicitudCreditoHipotecario, TipoProductoModel, ZonaModel, EstadoModel, DashboardModel, Canal } from 'src/app/shared/models/fisics';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';
import { GeneralListService } from 'src/app/shared/services/general-list.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes.service';
import { Variables } from 'src/app/shared/variables';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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
// import { Lookup } from '../../../shared/models/fisics/base/Lookup';
import { element } from 'protractor';
import Swal from 'sweetalert2';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};

const CANAL_DATA: Canal[] = [
  { id: 1, name: 'FFVV' },
  { id: 2, name: 'Red de Oficinas' },
];

@Component({
  selector: 'app-dashboard-credito',
  templateUrl: './dashboard-credito.component.html',
  styleUrls: ['./dashboard-credito.component.scss'],
  providers: [
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
  implements OnInit {
  displayedColumns: string[] = ['Id', 'Created', 'Fecha_Estado', 'Nombre_Titular',
    'N_Documento', 'Author', 'Estado', 'ZonaId', 'Oficina', 'Tipo_Producto', 'Sub_ProductoId',
    'Mon_Desembolso', 'Desembolso'];
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
  solicitudesEstadoList: SolicitudCreditoHipotecario[];
  solicitudesPorFechaCreacionList: SolicitudCreditoHipotecario[];
  solicitudesPorFechaEstadoList: SolicitudCreditoHipotecario[];

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
    this.valueOficina();
    this.valueSubProducto();
    // this.dashboardForm.controls.Vendedor.disable();
  }

  cargarListeneters() {
    this.listarSolicitudesEstado();
    this.listenerOficina();
    this.listenerTipoProducto();
    this.listenerZona();
    this.listenerTipoSubProducto();
    this.listenerEjecutivo();
    // this.listenerAll();
    // this.listenerFechaCreacion();
    // this.listenerFechaEstado();
    this.listenerFechaCreacionDesde();
    this.listenerFechaEstadoDesde();
  }

  getZona() {
    this.generalListService
      .get(Variables.listas.AdmZona)
      .then((zonaModelList) => (this.zonaModelList = zonaModelList))
      .catch((error) => console.error(error));
  }

  valueOficina(): any {
    this.dashboardForm.get('ZonaId').valueChanges.subscribe(selectedValue => {
      if (selectedValue) {
        this.generalListService.getByField(Variables.listas.AdmOficina, Variables.listas.AdmZonaId, selectedValue)
          .then((oficinaList: any) => this.oficinaList = oficinaList)
          .catch(error => console.error(error));
      }
    });
  }

  valueSubProducto(): any {
    this.dashboardForm.get('Tipo_ProductoId').valueChanges.subscribe(selectedValue => {
      if (selectedValue) {
        this.generalListService.getByField(Variables.listas.AdmTipoSubProducto, Variables.listas.AdmTipoProductoId, selectedValue)
          .then((tipoSubProductoList: any) => this.tipoSubProductoList = tipoSubProductoList)
          .catch(error => console.error(error));
      }
    });
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
    let solicitudes;
    if (this.dashboardForm.controls.Fecha_Creacion_Hasta.value) {

      const solicitudesporFecha = this.getSolicitudesFechaCreacion();
      solicitudes = solicitudesporFecha.filter((item) => item.EstadoId === estado);
    }
    else if (this.dashboardForm.controls.Fecha_Estado_Hasta.value) {

      const solicitudesporFechaEstado = this.getSolicitudesFechaEstado();
      solicitudes = solicitudesporFechaEstado.filter((item) => item.EstadoId === estado);
    }
    else {

      solicitudes = this.solicitudHipotecarioList.filter((item) => item.EstadoId === estado);
    }
    return solicitudes;
  }

  listenerZona() {
    this.dashboardForm.controls.ZonaId.valueChanges.subscribe((zona) => {
      if (zona !== Variables.constantes.ZonaIDFFVV) {
        this.dashboardForm.controls.Canal.setValue(2);
      } else {
        this.dashboardForm.controls.Canal.setValue(1);
      }
      const producto = this.dashboardForm.controls.Tipo_ProductoId.value;
      // console.log(producto);
      if (producto !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(zona, 0, producto, 0, 0, 0);
      } else {
        if (zona) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(zona, 0, 0, 0, 0, 0);
        } else if (zona !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado();
        }
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
  getSolicitudesFechaCreacion() {
    // this.dashboardForm.controls.Fecha_Creacion_Hasta.valueChanges.subscribe((fecHasta) => {
    const fecha1 = moment(this.dashboardForm.controls.Fecha_Creacion_Desde.value).format('DD/MM/YYYY');
    const fechaDesde = moment(fecha1, 'DD-MM-YYYY').toDate();
    const fecha2 = moment(this.dashboardForm.controls.Fecha_Creacion_Hasta.value).format('DD/MM/YYYY');
    const fechaHasta = moment(fecha2, 'DD-MM-YYYY').toDate();
    const solicitudes = this.solicitudHipotecarioList;
    let solicitudPorFecha;
    this.solicitudesPorFechaCreacionList = [];
    solicitudes.forEach(solicitud => {
      const fecha = moment(solicitud.Created).format('DD/MM/YYYY');
      const fechaEstado = moment(fecha, 'DD-MM-YYYY').toDate();
      if (fechaEstado >= fechaDesde && fechaEstado <= fechaHasta) {
        solicitudPorFecha = this.solicitudHipotecarioList.find(item => item.Id === solicitud.Id);
        this.solicitudesPorFechaCreacionList.push(solicitudPorFecha);
        //  setTimeout(() => {
        //   // const elmnt = document.getElementById('elemento');
        //   // elmnt.scrollIntoView();
        //   const elemento: HTMLElement = document.getElementById('element');
        //   this.scroll(elemento);
        //    }, 1000);
      }
    });
    this.showSolicitudes = false;
    return this.solicitudesPorFechaCreacionList;
  }
  getSolicitudesFechaEstado() {
    const fecha1 = moment(this.dashboardForm.controls.Fecha_Estado_Desde.value).format('DD/MM/YYYY');
    const fechaDesde = moment(fecha1, 'DD-MM-YYYY').toDate();
    const fecha2 = moment(this.dashboardForm.controls.Fecha_Estado_Hasta.value).format('DD/MM/YYYY');
    const fechaHasta = moment(fecha2, 'DD-MM-YYYY').toDate();
    const solicitudes = this.solicitudHipotecarioList;
    let solicitudPorFecha;
    this.solicitudesPorFechaEstadoList = [];
    solicitudes.forEach(solicitud => {
      const fecha = moment(solicitud.Fecha_Estado).format('DD/MM/YYYY');
      const fechaEstado = moment(fecha, 'DD-MM-YYYY').toDate();
      if (fechaEstado >= fechaDesde && fechaEstado <= fechaHasta) {
        solicitudPorFecha = this.solicitudHipotecarioList.find(item => item.Id === solicitud.Id);
        this.solicitudesPorFechaEstadoList.push(solicitudPorFecha);
      }
    });
    this.showSolicitudes = false;
    return this.solicitudesPorFechaEstadoList;
  }

  listarPorFechaCreacion() {
    const desde = this.dashboardForm.controls.Fecha_Creacion_Desde.value;
    const fechaDesde = moment(desde, 'DD-MM-YYYY').toDate();
    const hasta = this.dashboardForm.controls.Fecha_Creacion_Hasta.value;
    const fechaHasta = moment(hasta, 'DD-MM-YYYY').toDate();
    if (desde && hasta) {
      if (fechaHasta > fechaDesde) {
        this.listarSolicitudesEstado();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error...',
          text: 'Fecha Desde tiene que ser menor que fecha Hasta',
        });
      }
    }
  }

  listarPorFechaEstado() {
    const desde = this.dashboardForm.controls.Fecha_Estado_Desde.value;
    const fechaDesde = moment(desde, 'DD-MM-YYYY').toDate();
    const hasta = this.dashboardForm.controls.Fecha_Estado_Hasta.value;
    const fechaHasta = moment(hasta, 'DD-MM-YYYY').toDate();
    if (desde && hasta) {
      if (fechaHasta > fechaDesde) {
        this.listarSolicitudesEstado();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error...',
          text: 'Fecha Desde tiene que ser menor que fecha Hasta',
        });
      }
    }
  }

  listenerFechaCreacionDesde() {
    this.dashboardForm.controls.Fecha_Creacion_Desde.valueChanges.subscribe((fecHasta) => {
      if (fecHasta) {
        this.dashboardForm.controls.Fecha_Estado_Desde.setValue('');
        this.dashboardForm.controls.Fecha_Estado_Hasta.setValue('');
      }
    });
  }

  listenerFechaEstadoDesde() {
    this.dashboardForm.controls.Fecha_Estado_Desde.valueChanges.subscribe((fecHasta) => {
      if (fecHasta) {
        this.dashboardForm.controls.Fecha_Creacion_Desde.setValue('');
        this.dashboardForm.controls.Fecha_Creacion_Hasta.setValue('');
      }
    });
  }

  listenerOficina() {
    this.dashboardForm.controls.OficinaId.valueChanges.subscribe((value) => {
      // console.log(value);
      const zona = this.dashboardForm.controls.ZonaId.value;
      const producto = this.dashboardForm.controls.Tipo_ProductoId.value;
      const subproducto = this.dashboardForm.controls.Sub_ProductoId.value;
      // console.log(zona);
      if (zona !== null && producto !== null && subproducto !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(zona, value, producto, subproducto, 0, 0);
      } else if (zona !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(zona, value, 0, 0, 0, 0);
      } else if (producto !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(0, value, producto, 0, 0, 0);
      } else if (subproducto !== null) {
        this.showSolicitudes = false;
        this.listarSolicitudesEstado(0, value, 0, subproducto, 0, 0);
      } else {
        if (value) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(0, value, 0, 0, 0, 0);
        } else if (value !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado();
          this.dashboardForm.controls.Canal.setValue('Todas');
        }
      }
    });
  }

  listenerTipoProducto() {
    this.dashboardForm.controls.Tipo_ProductoId.valueChanges.subscribe(
      (value) => {
        const zona = this.dashboardForm.controls.ZonaId.value;
        const oficina = this.dashboardForm.controls.OficinaId.value;
        // console.log(zona);
        if (zona !== null && oficina !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(zona, oficina, value, 0, 0, 0);
        } else if (zona !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(zona, 0, value, 0, 0, 0);
        } else if (oficina !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(0, oficina, value, 0, 0, 0);
        } else {
          if (value) {
            this.showSolicitudes = false;
            this.listarSolicitudesEstado(0, 0, value, 0, 0, 0);
          } else if (value !== null) {
            this.showSolicitudes = false;
            this.listarSolicitudesEstado();
          }
        }
      }
    );
  }
  listenerTipoSubProducto() {
    this.dashboardForm.controls.Sub_ProductoId.valueChanges.subscribe(
      (value) => {
        const zona = this.dashboardForm.controls.ZonaId.value;
        const oficina = this.dashboardForm.controls.OficinaId.value;
        const producto = this.dashboardForm.controls.Tipo_ProductoId.value;
        // console.log(zona);
        if (zona !== null && oficina !== null && producto !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(zona, oficina, producto, value, 0, 0);
        } else if (zona !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(zona, 0, 0, value, 0, 0);
        } else if (oficina !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(0, oficina, 0, value, 0, 0);
        } else if (producto !== null) {
          this.showSolicitudes = false;
          this.listarSolicitudesEstado(0, 0, producto, value, 0, 0);
        } else {
          if (value) {
            this.showSolicitudes = false;
            this.listarSolicitudesEstado(0, 0, 0, value, 0, 0);

          } else if (value !== null) {
            this.showSolicitudes = false;
            this.listarSolicitudesEstado();
          }
        }
      }
    );
  }

  async listarSolicitudesEstado(idZona = 0, idOficina = 0, idTipoProducto = 0, idTipoSubProducto = 0, idEstado = 0, idAuthor = 0) {
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
            if (esRentaMixta) {
              if (solicitud.Tipo_RentaId.find(val => val === 3)) {
                // console.log(solicitud.Id);
                ansRentaMixta = estado.ANS_Mixta_3;
              } else {
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
              const tiempoPromedioEstacion = this.calcBusinessDays(fechaEstado, fechaActual);
              // console.log(tiempoPromedioEstacion);
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

          } else {
            if (solicitud.Fecha_Estado !== null) {
              const fechaEstado = moment(solicitud.Fecha_Estado);
              const tiempoPromedioEstacion = this.calcBusinessDays(fechaEstado, fechaActual);
              if (tiempoPromedioEstacion > estado.Valor_ANS) {
                fueraANS++;
                this.solicitudANSList.push(solicitudes[contador]);
              }
              tiempo += tiempoPromedioEstacion;
              tiempoPromedio = tiempo / solicitudes.length;
            }

            if (solicitud.Created !== null) {
              const fechaCreacion = moment(solicitud.Created);
              const tiempoPromedioT = this.calcBusinessDays(fechaCreacion, fechaActual);
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
      .get(Variables.listas.AdmEstado, 'Orden')
      .then((estadoList) => estadoList)
      .catch((error) => console.error(error));
    const estadosActivos = estados.filter((item) => item.DashBoard === true);
    return estadosActivos;
  }

  getSolicitudesPorEstado(estadoId: number, elemento: HTMLElement) {
    const solicitudes = this.filtraSolicitudes(estadoId);
    this.solicitudesEstadoList = solicitudes;
    this.dataSource = new MatTableDataSource<any>(this.solicitudesEstadoList);
    this.showSolicitudes = true;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.scroll(elemento);
    }, 1000);
  }

  getSolicitudesANS(cantidadSolicitudesANS: number, estadoId?: number, elemento?: HTMLElement) {
    let solicitudes;
    if (estadoId) {
      solicitudes = this.solicitudANSList.filter((item) => item.EstadoId === estadoId);
    } else {
      solicitudes = this.solicitudANSList.slice(0, cantidadSolicitudesANS);
    }
    this.solicitudesEstadoList = solicitudes;
    this.dataSource = new MatTableDataSource<any>(this.solicitudesEstadoList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.showSolicitudes = true;
    setTimeout(() => {
      this.scroll(elemento);
    }, 1000);
  }

  getSolicitudesANSAcumulado(cantidadSolicitudesANS: number, estadoId?: number, elemento?: HTMLElement) {
    let solicitudes;
    if (estadoId) {
      solicitudes = this.solicitudANSAcumuladoList.filter((item) => item.EstadoId === estadoId);
    } else {
      solicitudes = this.solicitudANSAcumuladoList.slice(0, cantidadSolicitudesANS);
    }
    this.solicitudesEstadoList = solicitudes;
    this.dataSource = new MatTableDataSource<any>(this.solicitudesEstadoList);
    this.dataSource.paginator = this.paginator;
    this.showSolicitudes = true;
    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.scroll(elemento);
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
    const hourStr = moment(startDate).format('HH');
    const hour = parseInt(hourStr, 10);
    // console.log(hour);
    // initial total
    let totalBusinessDays = 0;

    // normalize both start and end to beginning of the day
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const current = new Date(start);
    current.setDate(current.getDate() + 1);
    if (!(hour >= 9 && hour <= 17)) {
      current.setDate(current.getDate() + 1);
    }
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
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
