import { Component, OnInit, ViewChild, ApplicationRef, NgZone, NgModule } from '@angular/core';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';
import { Deferred } from 'ts-deferred';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatPaginator, } from '@angular/material/paginator';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatSidenav } from '@angular/material/sidenav';
import { EFiltroSeguimientoSolicitud } from 'src/app/shared/models/fisics/EFiltroSeguimientoSolicitud';
import { MasterBandejaService } from 'src/app/shared/services/masterbandeja.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SeguimientoSolicitudesService } from 'src/app/shared/services/seguimientosolicitudes.service';
import { Lookup } from 'src/app/shared/models/fisics/base/Lookup';
import { PagedItemCollection } from '@pnp/sp/items';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { EBandejaSeguimientoSolicitud } from 'src/app/shared/models/fisics/EBandejaSeguimientoSolicitud';
import { MasterLogic } from 'src/app/shared/models/logics/MasterLogic';
import { Variables } from 'src/app/shared/variables';
import { Funciones } from 'src/app/shared/funciones';
import { MasterService } from 'src/app/shared/services/master.service';
import { MasterBandejaLogic } from 'src/app/shared/models/logics/MasterBandejaLogic';

declare var $: any;

@Component({
  selector: 'app-logseguimiento',
  templateUrl: './logseguimiento.component.html',
  styleUrls: ['./logseguimiento.component.scss']
})
export class LogseguimientoComponent extends FormularioBase implements OnInit {
  currentUserName: string = '';
  userSolicitante: boolean = false;
  datosMaestrosBandeja: MasterBandejaLogic = new MasterBandejaLogic();
  tableQuery: any = {
    order: "",
    direction: "",
    pagesize: 5,
    limit: this.obtenerParametro("limit") || 5,
    page: this.obtenerParametro("page") || 1,
    filter: this.obtenerParametro("filter") || new EFiltroSeguimientoSolicitud()
  };

  isOpenMenu: boolean = false;
  promise: Promise<void>;

  seguimiento: EBandejaSeguimientoSolicitud[] = [];
  seguimiento_paged: PagedItemCollection<any[]>;
  seguimiento_paged_history: PagedItemCollection<any[]>[];
  page_last: number = -1;
  itemCount: number;

  dataSourceSeguimiento: EBandejaSeguimientoSolicitud[] = [];
  displayedColumnsSeguimientoSolicitud: string[] = [
    Variables.columnasSeguimiento.SolicitudHipotecario,
    Variables.columnasSeguimiento.NumeroDocumento,
    Variables.columnasSeguimiento.NombreTitular,
    Variables.columnasSeguimiento.Author,
    Variables.columnasSeguimiento.Created,
    Variables.columnasSeguimiento.Estado,
    Variables.columnasSeguimiento.Responsable,
    Variables.columnasSeguimiento.FechaAtencion,
    Variables.columnasSeguimiento.EstadoFinal,
    "TiempoAtencion",
    //"TiempoAtencionHoras"
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isFilterApplied = false;

  isCargando = true;

  nombreControles = {
    filtroSolicitante: 'filtroSolicitante'
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('sidenavfiltros', { static: true }) public myNav: MatSidenav;

  constructor(
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public masterService: MasterService,
    public masterbandejaService: MasterBandejaService,
    public zone: NgZone,
    public _spinner: SpinnerVisibilityService,
    public seguimientosolicitudesService: SeguimientoSolicitudesService,
    public excelService: ExcelService,
    public formBuilder: FormBuilder
  ) {
    super('Seguimiento Solicitudes', applicationRef, dialog, route, router, masterService, zone, _spinner);

    this.form = this.formBuilder.group({
      filtroSolicitante: ['']
    });
  }

  ngOnInit(): void {
    this.isCargando = true;
    this.mostrarProgreso();
    this.obtenerMaestrosYDatos().then(() => {

      this.currentUserName = this.datosMaestrosBandeja.currentUser.Title;
      this.userSolicitante = false;

      let order: string;

      if (this.obtenerParametro("order")) {
        order = (this.obtenerParametro("desc") ? "-" : "") + this.obtenerParametro("order");
      } else {
        order = "-Modified";
      }

      order = "Id";

      this.tableQuery = {
        order: order,
        direction: "",
        pagesize: 5,
        limit: this.obtenerParametro("limit") || 5,
        page: this.obtenerParametro("page") || 1,
        filter: this.obtenerParametro("filter") || new EFiltroSeguimientoSolicitud()
      };

      if (this.tableQuery.filter) this.isOpenMenu = true;

      this.setearFiltrosBusquedaPorEstado();

      this.getTablePagination();
      this.ocultarProgreso();
    },
      err => this.guardarLog(err)
    ).catch(error => {
      this.mostrarModalError("obtenerMaestrosYDatos", error);
    });
  }

  private setearFiltrosBusquedaPorEstado() {
    let estadosSeleccionados: number[] = [];

    estadosSeleccionados = this.datosMaestrosBandeja.maestroEstado.filter((elementoEstado: Lookup) => {
      return true;
    }).map((elementoEstado: Lookup) => elementoEstado.Id);

    this.tableQuery.filter.Estado = estadosSeleccionados;
  }

  obtenerMaestrosYDatos(): Promise<boolean> {
    this.mostrarProgreso();
    const d: Deferred<boolean> = new Deferred<boolean>();

    this.masterbandejaService.getDatosMaestros().then((masterBandejaLogic: MasterBandejaLogic) => {
      if (masterBandejaLogic.isDatos) {
        this.datosMaestrosBandeja = masterBandejaLogic;
        this.ocultarProgreso();
        d.resolve(true);
      }
    });

    return d.promise;
  }

  public irPaginaSolicitud(
    elemento: any
  ) {
    const url = environment.getRutaBaseApp() + "/hipotecario/solicitud/" + elemento.SolicitudHipotecario;
    window.open(url, '_blank');
  }

  public irPaginaExterna(
    nombrePagina: string,
    parametroQueryString: string,
    valorQueryString: string
  ) {
    if (parametroQueryString !== "") {
      const url = environment.getRutaBaseApp() + nombrePagina + '?' + parametroQueryString + '=' + valorQueryString;
      window.open(url, '_blank');
    } else {
      const url = environment.getRutaBaseApp() + nombrePagina;
      window.open(url, '_blank');
    }
  }

  reload() {
    this.getSolicitudes()
  }

  openSidenavMenu() {
    this.myNav.toggle();
    $('.my-left-sidenav').show();
    this.openMenu()
  };

  closeSidenavMenu() {
    this.myNav.toggle();
    $('.my-left-sidenav').hide();
  }

  openMenu() {
    this.isOpenMenu = true;
  }

  closeMenu() {
    this.isOpenMenu = false;
  }

  onKeydownNombreTitular(event) {
    /*if (event.key === "Enter") {
      this.closeSidenavMenu();
      this.getSolicitudes();
    }*/
  }

  limpiar(orden: string = "") {
    let order = "Id";

    if (orden) {
      order = orden;
    }

    this.tableQuery = {
      order,
      limit: this.obtenerParametro("limit") || 10,
      page: this.obtenerParametro("page") || 1,
      filter: this.obtenerParametro("filter") || new EFiltroSeguimientoSolicitud()
    };

    if (this.tableQuery.filter) this.isOpenMenu = true;

    this.removePeople("solicitante");
    this.setearFiltrosBusquedaPorEstado();

    this.getSolicitudes();
  }

  async getSolicitudes() {
    this.paginator.pageIndex = 0;
    this.page_last = -1;

    this.getTablePagination();
    this.closeSidenavMenu();
  }

  getTablePagination() {
    this.mostrarProgreso();
    this.isCargando = true;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.getSolicitudesPaged();
        }),
        map(data => {

          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          let vResultsLength = ((this.paginator.pageIndex + 1) * this.paginator.pageSize);
          let vResultsLengthTmp = this.resultsLength;
          if (this.resultsLength < vResultsLength) {
            this.resultsLength = vResultsLength;
          }
          if (data.length < this.paginator.pageSize) {
            vResultsLength = this.resultsLength - (this.paginator.pageSize - data.length);
            this.resultsLength = vResultsLength;
          }
          if (this.seguimiento_paged.hasNext) {
            if (vResultsLengthTmp < vResultsLength) {
              this.resultsLength = this.resultsLength + 1;
            }
          }
          this.isCargando = false;
          this.ocultarProgreso();
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.ocultarProgreso();
        this.dataSourceSeguimiento = data;
      });
  }

  async getSolicitudesPaged(): Promise<EBandejaSeguimientoSolicitud[]> {
    this.mostrarProgreso();

    this.tableQuery.filter.Author = this.getValorControlPeoplePicker(this.nombreControles.filtroSolicitante);

    if (this.tableQuery.filter.Estado.length === 0) {
      this.setearFiltrosBusquedaPorEstado();
    }

    let filter = this.tableQuery.filter;
    let order = this.sort.active;
    let desc = this.sort.direction;

    let direction = true;

    if (desc == "asc") {
      direction = true;
    } else if (desc == "desc") {
      direction = false;
    } else {
      order = null;
    }

    if (this.paginator.pageIndex == 0 || this.tableQuery.order != order || this.tableQuery.direction != desc || this.tableQuery.pagesize != this.paginator.pageSize) {

      this.tableQuery.order = order;
      this.tableQuery.direction = desc;
      this.tableQuery.pagesize = this.paginator.pageSize;

      this.seguimiento_paged_history = [];

      this.seguimiento_paged = await this.seguimientosolicitudesService.getBandejaSeguimientoSolicitudes(filter, order, direction, this.paginator.pageSize).then();

    } else {
      if (this.seguimiento_paged_history[this.paginator.pageIndex]) {
        this.seguimiento_paged = await this.seguimiento_paged_history[this.paginator.pageIndex - 1].getNext();
      } else {
        if (this.paginator.pageIndex > this.page_last) {
          if (this.seguimiento_paged.hasNext) {

            if (this.seguimiento_paged["nextUrl"] !== undefined) {
              this.seguimiento_paged["nextUrl"] = this.seguimiento_paged["nextUrl"].replace("https", "http");
            }

            this.seguimiento_paged = await this.seguimiento_paged.getNext();
          }
        }
      }
    }

    this.page_last = this.paginator.pageIndex;

    if (!this.seguimiento_paged_history[this.paginator.pageIndex]) {

      if (this.seguimiento_paged["nextUrl"] !== undefined) {
        this.seguimiento_paged["nextUrl"] = this.seguimiento_paged["nextUrl"].replace("https", "http");
      }

      this.seguimiento_paged_history[this.paginator.pageIndex] = this.seguimiento_paged;
    }

    const items: EBandejaSeguimientoSolicitud[] = this.seguimiento_paged.results.map(elemento => {
      return EBandejaSeguimientoSolicitud.parseJson(elemento);
    });

    this.ocultarProgreso();
    return items;
  }

  removePeople(tipoControl: string): void {

    if (tipoControl === 'solicitante') {
      this.form.get(this.nombreControles.filtroSolicitante).setValue([]);
      this.form.controls[this.nombreControles.filtroSolicitante].updateValueAndValidity();
    }
  }

  exportarExcel() {
    this.isCargando = true;
    this.mostrarProgreso();

    this.tableQuery.filter.Author = this.getValorControlPeoplePicker(this.nombreControles.filtroSolicitante);

    if (this.tableQuery.filter.Estado.length === 0) {
      this.setearFiltrosBusquedaPorEstado();
    }

    let filter = this.tableQuery.filter;
    let order = this.sort.active;
    let desc = this.sort.direction;

    let direction = true;

    if (desc == "asc") {
      direction = true;
    } else if (desc == "desc") {
      direction = false;
    } else {
      order = null;
    }

    this.seguimientosolicitudesService.getBandejaSeguimientoSolicitudes(filter, order, direction, 100000).then(
      (data: PagedItemCollection<any[]>) => {
        const items: EBandejaSeguimientoSolicitud[] = data.results.map(elemento => {
          return EBandejaSeguimientoSolicitud.parseJsonExcel(elemento);
        });

        const headers: string[] = ['N° Solicitud', 'Nro. Documento', 'Nombre Titular', 'Usuario Registro', 'Fecha Registro', 'Estado Inicial', 'Responsable Atención', 'Fecha Atención', 'Estado Final', 'Tiempo de Atención', 'Tiempo de Atención (Horas)'];
        const details: any[][] = items.map((item: any) => {
          const dataMap: any[] = [];

          dataMap.push(item.SolicitudHipotecario);
          dataMap.push(item.NumeroDocumento);
          dataMap.push(item.NombreTitular);
          dataMap.push(item.Author);
          dataMap.push(Funciones.dateHoraFormat(item.Created));
          dataMap.push(item.Estado);
          dataMap.push(item.Responsable);
          if (item.FechaAtencion !== null && item.FechaAtencion !== "") {
            dataMap.push(Funciones.dateHoraFormat(item.FechaAtencion));
          } else {
            dataMap.push(null);
          }
          dataMap.push(item.EstadoFinal);
          dataMap.push(item.TiempoAtencion);
          dataMap.push(item.TiempoAtencionHoras);

          return dataMap;
        });

        this.excelService.excelListadoSeguimientoSolicitudes('Seguimiento de Solicitudes', 'SeguimientoSolicitudes', headers, details);
        this.ocultarProgreso();
        this.isCargando = false;
      },
      err => this.guardarLog(err)
    );
  }
}

export interface IDictionary {
  [key: number]: PagedItemCollection<any[]>;
};