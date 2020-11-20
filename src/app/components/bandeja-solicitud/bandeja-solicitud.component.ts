import { Component, OnInit, ViewChild, ApplicationRef, NgZone,NgModule  } from '@angular/core';
import { Deferred } from 'ts-deferred';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormularioAT } from 'src/app/shared/pages/formularioAT';
import { IStatistics } from 'src/app/shared/models/fisics/IStatistics';
import { MasterService } from 'src/app/shared/services/master.service';
import { MasterLogic } from 'src/app/shared/models/logics/MasterLogic';
import { MatPaginator, } from '@angular/material/paginator';
import { MaestroMaterial } from 'src/app/shared/models/fisics/MaestroMaterial';
import { MaestroMaterialFilter } from 'src/app/shared/models/fisics/MaestroMaterialFilter';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
//import * as $ from 'jquery';
import { PagedItemCollection } from '@pnp/sp/items';
import { Lookup } from 'src/app/shared/models/fisics/base/Lookup';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import {  MatSidenav } from '@angular/material/sidenav';

import { SpinnerVisibilityService } from 'ng-http-loader';

import { MaestroMaterialService } from 'src/app/shared/services/maestromaterial.service';
import { Variables } from '../../../../src/app/shared/variables';

import { ExcelService } from '../../shared/services/excel.service';

declare var $:any;
@Component({
  selector: 'app-bandeja-solicitud',
  templateUrl: './bandeja-solicitud.component.html',
  styleUrls: ['./bandeja-solicitud.component.scss'],
})

export class BandejaSolicitudComponent  extends FormularioAT implements OnInit {
  esMiembroId: boolean;
  currentUserName: string = '';
  statistics: IStatistics;


  datosMaestros: MasterLogic = new MasterLogic();
  tableQuery: any = {
    order: "",
    direction: "",
    pagesize: 5,
    limit: this.obtenerParametro("limit") || 5,
    page: this.obtenerParametro("page") || 1,
    filter: this.obtenerParametro("filter") || new MaestroMaterialFilter()
  };
  isOpenMenu: boolean = false;
  promise: Promise<void>;
  projects: MaestroMaterial[] = [];
  materiales_paged: PagedItemCollection<any[]>;
  // materiales_paged_history: IDictionary = {};
  materiales_paged_history: PagedItemCollection<any[]>[];
  page_last: number = -1;
  itemCount: number;

  dataSourceProjects: MaestroMaterial[] = [];
  displayedColumnsProjects: string[] = [
    Variables.columns.Id,
   // Variables.columns.TextoBreveMaterial,
    Variables.columns.Creado,
    Variables.columns.MaestroFLujoEtapa,   
    Variables.columns.ResponsableLaboratorio,
    Variables.columns.EjecutivoComercial,
    Variables.columns.ResponsableDT,
    Variables.columns.ResponsableRDM,
    Variables.columns.EnBorrador
 ];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isFilterApplied = false;

  // userAdministrator = false;

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
    public maestroMaterialService: MaestroMaterialService,
    public excelService: ExcelService
  ) {
    super('Consulta de Solicitudes', applicationRef, dialog, route, router, masterService, zone,_spinner);

    this.esMiembroId = false;
  }

  ngOnInit() {
   // debugger;
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
          filter: this.obtenerParametro("filter") || new MaestroMaterialFilter()
        };
       // debugger;
        if (this.tableQuery.filter) this.isOpenMenu = true;
  
        this.setearFiltrosBusquedaPorOrigen();
  
        this.getFiltrosSession();
  
        // const groupUserAdministrator = this.datosMaestros.currentUser.Groups.filter(group => group.Title === Variables.Grupos.Administradores);
        // this.userAdministrator = (groupUserAdministrator && groupUserAdministrator.length > 0);
        this.validaUserAdministrator();
        this.getTablePagination();
        this.ocultarProgreso();

      },
      err => this.guardarLog( err )
    ).catch(error => {
      this.mostrarModalError("obtenerMaestrosYDatos", error);
    });
  }
  private setearFiltrosBusquedaPorOrigen() {
    let visFilterApplied = window.sessionStorage.getItem("Title");
    if(visFilterApplied){
      this.isFilterApplied = visFilterApplied=="1"?true:false;
    }
    if(!this.isFilterApplied){
      let estadosSeleccionados: number[] = [];

      estadosSeleccionados = this.datosMaestros.masterData.listStatusProject.filter((elementoEstado: Lookup) => {
        return elementoEstado.Id  > 0
      }).map((elementoEstado: Lookup) => elementoEstado.Id);
  
      this.tableQuery.filter.Status = estadosSeleccionados;
    }    
  }
  getFiltrosSession() {
    let title = window.sessionStorage.getItem("Title");
    if(title){
      this.tableQuery.filter.Title = title;
    }   

    let etapa = window.sessionStorage.getItem("Etapa");
    if(etapa){
      this.tableQuery.filter.Etapa = etapa.split(',');
    }   

    // console.log(this.tableQuery.filter);  
}
  cargarDatosPagina() {
    this.mostrarProgreso();
    this.statistics = <IStatistics>{};

    this.obtenerMaestrosYDatos().then(
      () => {
        this.currentUserName = this.datosMaestros.currentUser.Title;
        this.ocultarProgreso();
      },
      err => this.guardarLog( err )
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
    this.getProjects()
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
      this.getProjects();
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
      filter: this.obtenerParametro("filter") || new MaestroMaterialFilter()
    };

    if (this.tableQuery.filter) this.isOpenMenu = true;

    this.clearFiltrosSession();

    this.getProjects();

    this.setClearFiltrosAplicados();
  }
  setClearFiltrosAplicados() {
    window.sessionStorage.setItem("Title","");
    window.sessionStorage.setItem("Etapa","");
    this.isFilterApplied = false;
  }
  
  clearFiltrosSession() {
    sessionStorage.removeItem("Title");  
    sessionStorage.removeItem("Etapa"); 
    this.isFilterApplied = false;
  }

  async getProjects() {
    this.paginator.pageIndex = 0;
    this.page_last = -1
    this.setFiltrosSession();
    this.getTablePagination();
    this.closeSidenavMenu();
  }

  setFiltrosSession() {
    window.sessionStorage.setItem("Title",this.tableQuery.filter.Title);   
    window.sessionStorage.setItem("Etapa",this.tableQuery.filter.Etapa);
    this.isFilterApplied = true;
  }


  getTablePagination() {
    this.mostrarProgreso();
    //debugger;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          // console.log('switchMap');
          this.isLoadingResults = true;
          //return this.exampleDatabase!.getRepoIssues(this.sort.active, this.sort.direction, this.paginator.pageIndex);
          return this.getProjectsPaged();
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          // console.log(data);
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          let vResultsLength = ((this.paginator.pageIndex + 1) * this.paginator.pageSize);
          let vResultsLengthTmp = this.resultsLength;
          if(this.resultsLength < vResultsLength){
            this.resultsLength = vResultsLength;
          }
          if (data.length < this.paginator.pageSize) {
            vResultsLength = this.resultsLength - (this.paginator.pageSize - data.length);
            this.resultsLength = vResultsLength;
          }
          if (this.materiales_paged.hasNext) {
            if(vResultsLengthTmp < vResultsLength){
              this.resultsLength = this.resultsLength + 1;  
            }       
          }
          this.ocultarProgreso();
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.ocultarProgreso();
        // console.log(data);
        this.dataSourceProjects = data;
      });
  }

  async getProjectsPaged(): Promise<MaestroMaterial[]> {
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
    //debugger;
    //if ((this.paginator.pageIndex == 0 && this.page_last == -1) || this.tableQuery.order != order || this.tableQuery.direction != desc || this.tableQuery.pagesize != this.paginator.pageSize) {
    if (this.paginator.pageIndex == 0 || this.tableQuery.order != order || this.tableQuery.direction != desc || this.tableQuery.pagesize != this.paginator.pageSize) {
      // console.log('service');
      this.tableQuery.order = order;
      this.tableQuery.direction = desc;
      this.tableQuery.pagesize = this.paginator.pageSize;
      // this.materiales_paged_history = {};
      this.materiales_paged_history = [];

      // console.log(filter);
      this.materiales_paged = await this.maestroMaterialService.getSolicitudMateriales(filter, order, direction, this.paginator.pageSize, this.datosMaestros.currentUser, this.userAdministrator).then();
      console.log(this.materiales_paged);
      //debugger;
    } else {
      
      if (this.materiales_paged_history[this.paginator.pageIndex]) {
        this.materiales_paged = await this.materiales_paged_history[this.paginator.pageIndex - 1].getNext();
      } else {
        if (this.paginator.pageIndex > this.page_last) {
          if (this.materiales_paged.hasNext) {
            this.materiales_paged = await this.materiales_paged.getNext();
          }
        }
      }

      // console.log(this.materiales_paged);
    }
    //debugger;
    this.page_last = this.paginator.pageIndex;
    if (!this.materiales_paged_history[this.paginator.pageIndex]) {
      this.materiales_paged_history[this.paginator.pageIndex] = this.materiales_paged;
    }
    this.ocultarProgreso();
    
    return this.materiales_paged.results.map(elemento => {
      return  MaestroMaterial.parseJson(elemento);
    });
  }

  exportarExcel() {
    this.maestroMaterialService.getSolicitudMateriales(null, '', true, 100000, this.datosMaestros.currentUser, this.userAdministrator).then(
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
    
  }

}

export interface IDictionary {
  [key: number]: PagedItemCollection<any[]>;
};