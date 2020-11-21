import { Component, OnInit, ViewChild, ApplicationRef, NgZone, NgModule } from '@angular/core';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';
import { Deferred } from 'ts-deferred';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatPaginator, } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatSidenav } from '@angular/material/sidenav';
import { EFiltroBandejaSolicitud } from 'src/app/shared/models/fisics/EFiltroBandejaSolicitud';
import { MasterService } from 'src/app/shared/services/master.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes.service';
import { Lookup } from 'src/app/shared/models/fisics/base/Lookup';
import { PagedItemCollection } from '@pnp/sp/items';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { EBandejaSolicitud } from 'src/app/shared/models/fisics/EBandejaSolicitud';
import { MasterLogic } from 'src/app/shared/models/logics/MasterLogic';

declare var $: any;

@Component({
  selector: 'app-missolicitudespendientes',
  templateUrl: './missolicitudespendientes.component.html',
  styleUrls: ['./missolicitudespendientes.component.scss']
})
export class MissolicitudespendientesComponent extends FormularioBase implements OnInit {
  currentUserName: string = '';

  tableQuery: any = {
    order: "",
    direction: "",
    pagesize: 5,
    limit: this.obtenerParametro("limit") || 5,
    page: this.obtenerParametro("page") || 1,
    filter: this.obtenerParametro("filter") || new EFiltroBandejaSolicitud()
  };

  isOpenMenu: boolean = false;
  promise: Promise<void>;

  solicitudes: EBandejaSolicitud[] = [];
  solicitudes_paged: PagedItemCollection<any[]>;
  // solicitudes_paged_history: IDictionary = {};
  solicitudes_paged_history: PagedItemCollection<any[]>[];
  page_last: number = -1;
  itemCount: number;

  dataSourceSolicitudes: EBandejaSolicitud[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isFilterApplied = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('sidenavfiltros', { static: true }) public myNav: MatSidenav;

  constructor(
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public masterService: MasterService,
    public zone: NgZone,
    public _spinner: SpinnerVisibilityService,
    public solicitudesService: SolicitudesService,
    public excelService: ExcelService
  ) {
    super('Mis Solicitudes Pendientes', applicationRef, dialog, route, router, masterService, zone, _spinner);

  }

  ngOnInit(): void {  
    this.mostrarProgreso();
    this.obtenerMaestrosYDatos().then(
      () => {
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
          filter: this.obtenerParametro("filter") || new EFiltroBandejaSolicitud()
        };

        if (this.tableQuery.filter) this.isOpenMenu = true;

        //this.setearFiltrosBusquedaPorOrigen();
        //this.validaUserAdministrator();
        this.getTablePagination();
        this.ocultarProgreso();
      },
      err => this.guardarLog(err)
    ).catch(error => {
      this.mostrarModalError("obtenerMaestrosYDatos", error);
    });

  }

  private setearFiltrosBusquedaPorOrigen() {
    let visFilterApplied = window.sessionStorage.getItem("Title");
    if (visFilterApplied) {
      this.isFilterApplied = visFilterApplied == "1" ? true : false;
    }
    if (!this.isFilterApplied) {
      let estadosSeleccionados: number[] = [];

      estadosSeleccionados = this.datosMaestros.masterData.listStatusProject.filter((elementoEstado: Lookup) => {
        return elementoEstado.Id > 0
      }).map((elementoEstado: Lookup) => elementoEstado.Id);

      this.tableQuery.filter.Status = estadosSeleccionados;
    }
  }

  cargarDatosPagina() {
    this.mostrarProgreso();

    this.obtenerMaestrosYDatos().then(
      () => {
        this.currentUserName = this.datosMaestros.currentUser.Title;
        this.ocultarProgreso();
      },
      err => this.guardarLog(err)
    );
  }

  obtenerMaestrosYDatos(): Promise<boolean> {
    this.mostrarProgreso();
    const d: Deferred<boolean> = new Deferred<boolean>();

    this.masterService
      .getDatosMaestros()
      .subscribe((masterLogic: MasterLogic) => {
        if (masterLogic.isDatos) {
          this.datosMaestros = masterLogic;
          this.ocultarProgreso();        
          d.resolve(true);
        }
      });

    return d.promise;
  }

  public irPaginaExterna(
    nombrePagina: string,
    parametroQueryString: string,
    valorQueryString: string
  ) {
    const url =
      environment.getRutaBaseApp() +
      nombrePagina +
      '?' +
      parametroQueryString +
      '=' +
      valorQueryString;

    window.open(url, '_blank');
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
  onKeydownCodigo(event) {
    if (event.key === "Enter") {
      this.closeSidenavMenu();
      this.getSolicitudes();
    }
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
      filter: this.obtenerParametro("filter") || new EFiltroBandejaSolicitud()
    };

    if (this.tableQuery.filter) this.isOpenMenu = true;

    this.getSolicitudes();

    this.setClearFiltrosAplicados();
  }
  setClearFiltrosAplicados() {
    window.sessionStorage.setItem("Title", "");
    window.sessionStorage.setItem("Etapa", "");
    this.isFilterApplied = false;
  }
 
  async getSolicitudes() {
    this.paginator.pageIndex = 0;
    this.page_last = -1
    this.setFiltrosSession();
    this.getTablePagination();
    this.closeSidenavMenu();
  }

  setFiltrosSession() {
    window.sessionStorage.setItem("Title", this.tableQuery.filter.Title);
    window.sessionStorage.setItem("Etapa", this.tableQuery.filter.Etapa);
    this.isFilterApplied = true;
  }

  getTablePagination() {
    this.mostrarProgreso();

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
          if (this.solicitudes_paged.hasNext) {
            if (vResultsLengthTmp < vResultsLength) {
              this.resultsLength = this.resultsLength + 1;
            }
          }
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
        this.dataSourceSolicitudes = data;
      });
  }

  async getSolicitudesPaged(): Promise<EBandejaSolicitud[]> {
    this.mostrarProgreso();
    let filter = this.tableQuery.filter;
    console.log(this.sort);
    console.log(this.sort.active);
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

      this.solicitudes_paged_history = [];

      this.solicitudes_paged = await this.solicitudesService.getBandejaMisSolicitudesPendientes(filter, order, direction, this.paginator.pageSize, this.datosMaestros.currentUser, this.userAdministrator).then();
      console.log(this.solicitudes_paged);

    } else {

      if (this.solicitudes_paged_history[this.paginator.pageIndex]) {
        this.solicitudes_paged = await this.solicitudes_paged_history[this.paginator.pageIndex - 1].getNext();
      } else {
        if (this.paginator.pageIndex > this.page_last) {
          if (this.solicitudes_paged.hasNext) {
            this.solicitudes_paged = await this.solicitudes_paged.getNext();
          }
        }
      }
    }

    this.page_last = this.paginator.pageIndex;

    if (!this.solicitudes_paged_history[this.paginator.pageIndex]) {
      this.solicitudes_paged_history[this.paginator.pageIndex] = this.solicitudes_paged;
    }
    debugger;
    const items : EBandejaSolicitud[] = this.solicitudes_paged.results.map(elemento => {
      return EBandejaSolicitud.parseJson(elemento);
    });
   
    console.dir(items);
    this.ocultarProgreso();
    return items;    
  }

  exportarExcel() {
  /*  this.solicitudesService.getBandejaMisSolicitudesPendientes(null, '', true, 100000, this.datosMaestros.currentUser, this.userAdministrator).then(
      (data: PagedItemCollection<any[]>) => {
        const maestroMaterial: MaestroMaterial[] = data.results.map(elemento => {
          return MaestroMaterial.parseJson(elemento);
        });

        // console.log(maestroMaterial);
        const headers: string[] = ['ID', 'FEC. SOLICITUD', 'ETAPA', 'LAB', 'LDN', 'D.T.', 'R.D.M.', 'BORRADOR'];
        const details: any[][] = maestroMaterial.map((item: any) => {
          const dataMap: any[] = [];
          dataMap.push(item.Id);
          dataMap.push(item.Created);
          dataMap.push(item.MaestroFLujoEtapa.Title);
          dataMap.push(item.ResponsableLaboratorio);
          dataMap.push(item.EjecutivoComercial);
          dataMap.push(item.ResponsableDT);
          dataMap.push(item.ResponsableRDM);
          dataMap.push(item.EnBorrador ? 'Sí' : 'No');

          return dataMap;
        });

        console.log(details);
        this.excelService.excelListadoGeneral('Consulta Solicitudes', 'ConsultaSolicitudes', headers, details);
      },
      err => this.guardarLog(err)
    );
*/
  }
}

export interface IDictionary {
  [key: number]: PagedItemCollection<any[]>;
};