import { Injectable } from '@angular/core';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';
import { Item, IItemAddResult, IItemUpdateResult, PagedItemCollection } from '@pnp/sp/items';
import { EBandejaSolicitud } from '../models/fisics/EBandejaSolicitud';
import { environment } from 'src/environments/environment';
import { Variables } from '../variables';
import { User } from '../models/fisics/base/User';
import { Lookup } from '../models/fisics/base/Lookup';
import { ProductProposalStatus } from '../models/fisics/State';
import { EFiltroBandejaSolicitud } from '../models/fisics/EFiltroBandejaSolicitud';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { EDashboardSolicitud } from '../models/fisics/EDashboardSolicitud';
import { ListItem } from '../models/fisics/base/ListItem';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private listaSolicitudes: IList;

  constructor() {
    sp.setup({
      sp: {
        baseUrl: `${environment.proxyUrl}${environment.webRelativeUrl}`
      }
    });

    this.listaSolicitudes = sp.web.lists.getByTitle(Variables.listas.Solicitudes);

  }

  async getBandejaMisSolicitudesPendientes(
    filter: EFiltroBandejaSolicitud,
    orderBy: string,
    ascending: boolean,
    pagesize: number,
    usuario: User,
    solicitante: boolean,
    analistaRiesgo: boolean,
  ): Promise<PagedItemCollection<any[]>> {

    const selectFields = EBandejaSolicitud.getColumnasSelect();
    const expandFields = EBandejaSolicitud.getColumnasExpand();

    let query = this.listaSolicitudes.items.expand(...expandFields).select(...selectFields);

    let filterArr = [];

    if (solicitante) filterArr.push(`(${Variables.columnasSolicitud.Author}/Id  eq ${usuario.Id})`);

    if (analistaRiesgo) filterArr.push(`(${Variables.columnasSolicitud.Anlista_Riesgos}/Id  eq ${usuario.Id})`);

    if (filter) {

      if (filter.Estado && filter.Estado.length) {
        filterArr.push(`(${filter.Estado.map(x => `(${Variables.columnasSolicitud.Estado}/Id eq '${x}')`).join(" or ")})`);
      }

      if (filter.Id && filter.Id.length > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Id}  eq ${filter.Id})`);
      }

      if (filter.Author && filter.Author > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Author}/Id  eq ${filter.Author})`);
      }

      if (filter.NombreTitular && filter.NombreTitular.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NombreTitular.trim()}',${Variables.columnasSolicitud.NombreTitular}))`);
      }

      if (filter.TipoDocumento && filter.TipoDocumento > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoDocumento}/Id  eq ${filter.TipoDocumento})`);
      }

      if (filter.NumeroDocumento && filter.NumeroDocumento.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NumeroDocumento.trim()}',${Variables.columnasSolicitud.NumeroDocumento}))`);
      }

      if (filter.TipoProducto && filter.TipoProducto > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoProducto}/Id  eq ${filter.TipoProducto})`);
      }

      if (filter.Moneda && filter.Moneda > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Moneda}/Id  eq ${filter.Moneda})`);
      }

      if (filter.ModalidadPago && filter.ModalidadPago > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.ModalidadPago}/Id  eq ${filter.ModalidadPago})`);
      }

      if (filter.Financiamiento) {
        filterArr.push(`(${Variables.columnasSolicitud.Financiamiento}/Id  eq ${filter.Financiamiento})`);
      }

      if (filter.Zona && filter.Zona > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Zona}/Id  eq ${filter.Zona})`);
      }

      if (filter.Oficina && filter.Oficina > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Oficina}/Id  eq ${filter.Oficina})`);
      }

      if (filter.SustentoIngreso) {
        filterArr.push(`(${Variables.columnasSolicitud.SustentoIngreso}/Id  eq ${filter.SustentoIngreso})`);
      }

      if (filter.Created) {
        const fechaDesde = moment(filter.Created).format('YYYY-MM-DDT') + '00:00:00.000Z';
        filterArr.push(`(datetime'${fechaDesde}' lt ${Variables.columnasSolicitud.Created})`);

        const fechaHasta = moment(filter.Created).format('YYYY-MM-DDT') + '23:59:59.000Z';
        filterArr.push(`(datetime'${fechaHasta}' ge ${Variables.columnasSolicitud.Created})`);
      }

      if (filter.FechaEstadoDesde) {
        const fechaDesde = moment(filter.FechaEstadoDesde).format('YYYY-MM-DDT') + '00:00:00.000Z';
        filterArr.push(`(datetime'${fechaDesde}' lt ${Variables.columnasSolicitud.FechaEstado})`);
      }

      if (filter.FechaEstadoHasta) {
        const fechaHasta = moment(filter.FechaEstadoHasta).format('YYYY-MM-DDT') + '23:59:59.000Z';
        filterArr.push(`(datetime'${fechaHasta}' ge ${Variables.columnasSolicitud.FechaEstado})`);
      }

      if (filter.AnalistaRiesgos && filter.AnalistaRiesgos > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Anlista_Riesgos}/Id  eq ${filter.AnalistaRiesgos})`);
      }
    }

    query = query.filter(filterArr.join(" and "));

    if (orderBy != undefined && orderBy.length > 0) {
      query = query.orderBy(orderBy, ascending);
    }
    if (pagesize == undefined) {
      pagesize = 5;
    }
    let results = await query
      .top(pagesize)
      .getPaged().then(p => {

        return p;
      });

    return results;
  }

  async getBandejaTrabajoGestor(
    filter: EFiltroBandejaSolicitud,
    orderBy: string,
    ascending: boolean,
    pagesize: number,
    usuario: User,
    solicitante: boolean,
    analistaRiesgo: boolean,
  ): Promise<PagedItemCollection<any[]>> {

    const selectFields = EBandejaSolicitud.getColumnasSelectBandejaTrabajoGestor();
    const expandFields = EBandejaSolicitud.getColumnasExpandBandejaTrabajoGestor();

    let query = this.listaSolicitudes.items.expand(...expandFields).select(...selectFields);

    let filterArr = [];

    if (solicitante) filterArr.push(`(${Variables.columnasSolicitud.Author}/Id  eq ${usuario.Id})`);

    if (analistaRiesgo) filterArr.push(`(${Variables.columnasSolicitud.Anlista_Riesgos}/Id  eq ${usuario.Id})`);

    if (filter) {

      debugger;

      if (filter.Estado && filter.Estado.length) {

        let filtro = `(${filter.Estado.map(x => `(${Variables.columnasSolicitud.Estado}/Id eq '${x}')`).join(" or ")}`;

        filtro += ` or (${Variables.columnasSolicitud.EstadoLegal}/Id eq 2)`;

        filtro += ` or (${Variables.columnasSolicitud.EstadoMiVivienda}/Id eq 3))`;

        filterArr.push(filtro);
      }

      if (filter.Id && filter.Id.length > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Id}  eq ${filter.Id})`);
      }

      if (filter.Author && filter.Author > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Author}/Id  eq ${filter.Author})`);
      }

      if (filter.NombreTitular && filter.NombreTitular.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NombreTitular.trim()}',${Variables.columnasSolicitud.NombreTitular}))`);
      }

      if (filter.TipoDocumento && filter.TipoDocumento > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoDocumento}/Id  eq ${filter.TipoDocumento})`);
      }

      if (filter.NumeroDocumento && filter.NumeroDocumento.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NumeroDocumento.trim()}',${Variables.columnasSolicitud.NumeroDocumento}))`);
      }

      if (filter.TipoProducto && filter.TipoProducto > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoProducto}/Id  eq ${filter.TipoProducto})`);
      }

      if (filter.Moneda && filter.Moneda > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Moneda}/Id  eq ${filter.Moneda})`);
      }

      if (filter.ModalidadPago && filter.ModalidadPago > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.ModalidadPago}/Id  eq ${filter.ModalidadPago})`);
      }

      if (filter.Financiamiento) {
        filterArr.push(`(${Variables.columnasSolicitud.Financiamiento}/Id  eq ${filter.Financiamiento})`);
      }

      if (filter.Zona && filter.Zona > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Zona}/Id  eq ${filter.Zona})`);
      }

      if (filter.Oficina && filter.Oficina > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Oficina}/Id  eq ${filter.Oficina})`);
      }

      if (filter.SustentoIngreso) {
        filterArr.push(`(${Variables.columnasSolicitud.SustentoIngreso}/Id  eq ${filter.SustentoIngreso})`);
      }

      if (filter.Created) {
        const fechaDesde = moment(filter.Created).format('YYYY-MM-DDT') + '00:00:00.000Z';
        filterArr.push(`(datetime'${fechaDesde}' lt ${Variables.columnasSolicitud.Created})`);

        const fechaHasta = moment(filter.Created).format('YYYY-MM-DDT') + '23:59:59.000Z';
        filterArr.push(`(datetime'${fechaHasta}' ge ${Variables.columnasSolicitud.Created})`);
      }

      if (filter.FechaEstadoDesde) {
        const fechaDesde = moment(filter.FechaEstadoDesde).format('YYYY-MM-DDT') + '00:00:00.000Z';
        filterArr.push(`(datetime'${fechaDesde}' lt ${Variables.columnasSolicitud.FechaEstado})`);
      }

      if (filter.FechaEstadoHasta) {
        const fechaHasta = moment(filter.FechaEstadoHasta).format('YYYY-MM-DDT') + '23:59:59.000Z';
        filterArr.push(`(datetime'${fechaHasta}' ge ${Variables.columnasSolicitud.FechaEstado})`);
      }

      if (filter.AnalistaRiesgos && filter.AnalistaRiesgos > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Anlista_Riesgos}/Id  eq ${filter.AnalistaRiesgos})`);
      }
    }

    query = query.filter(filterArr.join(" and "));

    if (orderBy != undefined && orderBy.length > 0) {
      query = query.orderBy(orderBy, ascending);
    }
    if (pagesize == undefined) {
      pagesize = 5;
    }
    let results = await query
      .top(pagesize)
      .getPaged().then(p => {

        return p;
      });

    return results;
  }

  async getBandejaTrabajoLegal(
    filter: EFiltroBandejaSolicitud,
    orderBy: string,
    ascending: boolean,
    pagesize: number,   
    legal: boolean,
    mivienda: boolean,
    gestor: boolean,
  ): Promise<PagedItemCollection<any[]>> {

    const selectFields = EBandejaSolicitud.getColumnasSelectBandejaTrabajoLegal();
    const expandFields = EBandejaSolicitud.getColumnasExpandBandejaTrabajoLegal();

    let query = this.listaSolicitudes.items.expand(...expandFields).select(...selectFields);

    let filterArr = [];

    if (legal) filterArr.push(`(${Variables.columnasSolicitud.EnLegal}  eq 1)`);

    if (mivienda) filterArr.push(`(${Variables.columnasSolicitud.EnMiVivienda}  eq 1)`);

    if (gestor) filterArr.push(`(${Variables.columnasSolicitud.EnGestor}  eq 1)`);

    if (filter) {

      if (filter.Id && filter.Id.length > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Id}  eq ${filter.Id})`);
      }

      if (filter.Author && filter.Author > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Author}/Id  eq ${filter.Author})`);
      }

      if (filter.NombreTitular && filter.NombreTitular.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NombreTitular.trim()}',${Variables.columnasSolicitud.NombreTitular}))`);
      }

      if (filter.TipoDocumento && filter.TipoDocumento > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoDocumento}/Id  eq ${filter.TipoDocumento})`);
      }

      if (filter.NumeroDocumento && filter.NumeroDocumento.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NumeroDocumento.trim()}',${Variables.columnasSolicitud.NumeroDocumento}))`);
      }

      if (filter.TipoProducto && filter.TipoProducto > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoProducto}/Id  eq ${filter.TipoProducto})`);
      }

      if (filter.Moneda && filter.Moneda > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Moneda}/Id  eq ${filter.Moneda})`);
      }

      if (filter.ModalidadPago && filter.ModalidadPago > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.ModalidadPago}/Id  eq ${filter.ModalidadPago})`);
      }

      if (filter.Financiamiento) {
        filterArr.push(`(${Variables.columnasSolicitud.Financiamiento}/Id  eq ${filter.Financiamiento})`);
      }

      if (filter.Zona && filter.Zona > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Zona}/Id  eq ${filter.Zona})`);
      }

      if (filter.Oficina && filter.Oficina > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Oficina}/Id  eq ${filter.Oficina})`);
      }

      if (filter.SustentoIngreso) {
        filterArr.push(`(${Variables.columnasSolicitud.SustentoIngreso}/Id  eq ${filter.SustentoIngreso})`);
      }

      if (filter.Created) {
        const fechaDesde = moment(filter.Created).format('YYYY-MM-DDT') + '00:00:00.000Z';
        filterArr.push(`(datetime'${fechaDesde}' lt ${Variables.columnasSolicitud.Created})`);

        const fechaHasta = moment(filter.Created).format('YYYY-MM-DDT') + '23:59:59.000Z';
        filterArr.push(`(datetime'${fechaHasta}' ge ${Variables.columnasSolicitud.Created})`);
      }

      if (filter.FechaEstadoDesde) {
        const fechaDesde = moment(filter.FechaEstadoDesde).format('YYYY-MM-DDT') + '00:00:00.000Z';
        filterArr.push(`(datetime'${fechaDesde}' lt ${Variables.columnasSolicitud.FechaEstado})`);
      }

      if (filter.FechaEstadoHasta) {
        const fechaHasta = moment(filter.FechaEstadoHasta).format('YYYY-MM-DDT') + '23:59:59.000Z';
        filterArr.push(`(datetime'${fechaHasta}' ge ${Variables.columnasSolicitud.FechaEstado})`);
      }

      if (filter.AnalistaRiesgos && filter.AnalistaRiesgos > 0) {
        filterArr.push(`(${Variables.columnasSolicitud.Anlista_Riesgos}/Id  eq ${filter.AnalistaRiesgos})`);
      }
    }

    query = query.filter(filterArr.join(" and "));

    if (orderBy != undefined && orderBy.length > 0) {
      query = query.orderBy(orderBy, ascending);
    }
    if (pagesize == undefined) {
      pagesize = 5;
    }
    let results = await query
      .top(pagesize)
      .getPaged().then(p => {

        return p;
      });

    return results;
  }

  public async getItemById(itemId: any): Promise<any> {
    // return new Promise((resolve, reject) => {
    if (sp !== null && sp !== undefined) {

      const item = await this.listaSolicitudes.items
        .expand(...['Author', 'Anlista_Riesgos', 'UsuarioIngresoFile'])
        .select(...['*', 'Author/Title', 'Author/Id', 'Anlista_Riesgos/Title', 'Anlista_Riesgos/Id', 'UsuarioIngresoFile/Title', 'UsuarioIngresoFile/Id'])
        // .getById(itemId)
        .filter(`Id eq ${itemId}`)
        .get();
      // resolve(item);
      // console.log({item});
      return item;
      // } else {
      //     reject('Failed getting list data...');
    }
    // });
  }

  async save(id: number, solicitudCreditoHipotecario: any): Promise<boolean> {

    try {
      let iar: IItemAddResult;

      if (id === 0) {
        iar = await this.listaSolicitudes.items.add(
          solicitudCreditoHipotecario
        );
      } else {
        iar = await this.listaSolicitudes.items.getById(id).update(
          solicitudCreditoHipotecario
        );
      }

      return true;

    } catch (error) {
      throw error;
    }
  }

  public get(orderField = '', orderAscending = true): Promise<any> {
    return new Promise((resolve, reject) => {
      if (sp !== null && sp !== undefined) {
        // const listExpand = this.variables.ListExpands[listName];
        // if (listExpand) {

        // }
        let query = sp.web.lists.getByTitle(Variables.listas.AdmSolicitudCreditoHipotecario).items
          .expand(...['Ejecutivo', 'Anlista_Riesgos', 'Author', 'Estado', 'Oficina', 'Tipo_Producto', 'Sub_Producto'])
          .select(...['*', 'Ejecutivo/Title', 'Ejecutivo/Id', 'Anlista_Riesgos/Title', 'Anlista_Riesgos/Id', 'Author/Title', 'Author/Id',
            'Estado/Title', 'Estado/Id', 'Oficina/Title', 'Oficina/Id', 'Tipo_Producto/Id', 'Tipo_Producto/Title', 'Sub_Producto/Id', 'Sub_Producto/Title']);

        if (orderField !== '') {
          query = query.orderBy(orderField, orderAscending);
        }

        const items = query.top(4999).get();
        // // console.log({items});
        resolve(items);
      } else {
        reject('Failed getting list data...');
      }
    });
  }

  public async getByFields(fieldsFilter: string[], valuesFilter: any[], orderField = '', orderAscending = true): Promise<any> {
    return new Promise((resolve, reject) => {
      if (sp !== null && sp !== undefined) {
        const queryFilter = fieldsFilter.map((fieldFilter, index) => `${fieldFilter} eq ${valuesFilter[index]}`).join(' and ');

        let query = sp.web.lists.getByTitle(Variables.listas.AdmSolicitudCreditoHipotecario)
          .items
          .expand(...['Ejecutivo', 'Anlista_Riesgos', 'Author', 'Estado', 'Oficina', 'Tipo_Producto', 'Sub_Producto'])
          .select(...['*', 'Ejecutivo/Title', 'Ejecutivo/Id', 'Anlista_Riesgos/Title', 'Anlista_Riesgos/Id', 'Author/Title', 'Author/Id',
            'Estado/Title', 'Estado/Id', 'Oficina/Title', 'Oficina/Id', 'Tipo_Producto/Id', 'Tipo_Producto/Title', 'Sub_Producto/Id', 'Sub_Producto/Title'])
          .filter(queryFilter);

        if (orderField !== '') {
          query = query.orderBy(orderField, orderAscending);
        }

        const items = query.top(4999).get();
        // console.log({items});
        resolve(items);
      } else {
        reject('Failed getting list data...');
      }
    });
  }

  public async getDashboard(orderField = '', orderAscending = true): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (sp !== null && sp !== undefined) {
        const selectFields = EDashboardSolicitud.getColumnasSelect();
        const expandFields = EDashboardSolicitud.getColumnasExpand();
        // use odata operators for more efficient queries
        let query = await sp.web.lists.getByTitle(Variables.listas.AdmSolicitudCreditoHipotecario)
        .items.select(...selectFields).expand(...expandFields);
        if (orderField !== '') {
          query = query.orderBy(orderField, orderAscending);
        }
        const items = query.top(4999).get();
        // // console.log({items});
        resolve(items);
      } else {
        reject('Failed getting list data...');
      }
    });
  }


  public async getDashboardByFields(fieldsFilter: string[], valuesFilter: any[], orderField = '', orderAscending = true): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (sp !== null && sp !== undefined) {
        const queryFilter = fieldsFilter.map((fieldFilter, index) => `${fieldFilter} eq ${valuesFilter[index]}`).join(' and ');
        const selectFields = EDashboardSolicitud.getColumnasSelect();
        const expandFields = EDashboardSolicitud.getColumnasExpand();
        // use odata operators for more efficient queries
        let query = await sp.web.lists.getByTitle(Variables.listas.AdmSolicitudCreditoHipotecario)
        .items
        .select(...selectFields).expand(...expandFields)
        .filter(queryFilter);
        if (orderField !== '') {
          query = query.orderBy(orderField, orderAscending);
        }
        const items = query.top(4999).get();
        // console.log({items});
        resolve(items);
      } else {
        reject('Failed getting list data...');
      }
    });
  }

  public async getSolicitudSeguimiento() {
    // let startDate = new Date();
    // const december = 11;
    // const enero = 0;
    // let futureDate = new Date();
    // const dayToday = moment().format('DD');
    // const monthToday = moment().format('M');
    // const yearToday = moment().format('YYYY');
    // const DiaHoy = parseInt(dayToday, 10);
    // const MesHoy = parseInt(monthToday, 10);
    // const YearHoy = parseInt(yearToday, 10);
    // if (mes === enero) {
    //   startDate = new Date(year - 1, 11, 1);
    //   futureDate = new Date(YearHoy, MesHoy, DiaHoy);
    // } else if (mes === december) {
    //   startDate = new Date(year, 10, 1);
    //   futureDate = new Date(YearHoy, MesHoy, DiaHoy);
    // }else{
    //   startDate = new Date(year, mes - 1, 1);
    //   futureDate = new Date(YearHoy, MesHoy, DiaHoy);
    // }
    // const filterString = `Created ge datetime'${startDate.toISOString()}' and Created le datetime'${futureDate.toISOString()}'`;
    return new Promise((resolve, reject) => {
      if (sp !== null && sp !== undefined) {
        const query = sp.web.lists.getByTitle(Variables.listas.FlujoSeguimientoEtapa).items;
        // if (orderField !== '') {
        //     query = query.orderBy(orderField, orderAscending);
        // }
        // const items = query;
        const items = query.top(10000000).get();
        console.log({items});
        resolve(items);
      } else {
          reject('Failed getting list data...');
      }
  });

  }
  
  /*SERVICIO QUE TRAE EL FLUJOGUIMIENTO POR MES**/
  // public async getSolicitudSeguimiento(listName: string, mes = 0, year = 0 , orderField = '', orderAscending = true) {
  //   let startDate = new Date();
  //   const december = 11;
  //   const enero = 0;
  //   let futureDate = new Date();
  //   const dayToday = moment().format('DD');
  //   const monthToday = moment().format('M');
  //   const yearToday = moment().format('YYYY');
  //   const DiaHoy = parseInt(dayToday, 10);
  //   const MesHoy = parseInt(monthToday, 10);
  //   const YearHoy = parseInt(yearToday, 10);
  //   if (mes === enero) {
  //     startDate = new Date(year - 1, 11, 1);
  //     futureDate = new Date(YearHoy, MesHoy, DiaHoy);
  //   } else if (mes === december) {
  //     startDate = new Date(year, 10, 1);
  //     futureDate = new Date(YearHoy, MesHoy, DiaHoy);
  //   }else{
  //     startDate = new Date(year, mes - 1, 1);
  //     futureDate = new Date(YearHoy, MesHoy, DiaHoy);
  //   }
  //   const filterString = `Created ge datetime'${startDate.toISOString()}' and Created le datetime'${futureDate.toISOString()}'`;
  //   return new Promise((resolve, reject) => {
  //     if (sp !== null && sp !== undefined) {
  //       const query = sp.web.lists.getByTitle(listName).items.filter(filterString).getAll();
  //       // if (orderField !== '') {
  //       //     query = query.orderBy(orderField, orderAscending);
  //       // }
  //       const items = query;
  //         // const items = query.top(4999).get();
  //       console.log({items});
  //       resolve(items);
  //     } else {
  //         reject('Failed getting list data...');
  //     }
  // });

  // }
  
  // public getSolicitudesFecha(){
  //   const startDate = new Date(2020, 11, 1);
  //   const futureDate = new Date(2021, 0, 1);
  //   const filterString = `Created ge datetime'${startDate.toISOString()}' and Created le datetime'${futureDate.toISOString()}'`;
  //   let query = sp.web.lists.getByTitle(Variables.listas.AdmSolicitudCreditoHipotecario).items.top(4999).
  //   filter(filterString).get().then((items: any[]) => {
  //       const returnedPMeetings = items.map((item) => ({ key: item.id, text: item.Created }));
  //       // this.setState({ MeetingsList: returnedPMeetings });
  //       console.log(returnedPMeetings);
  //   });
  // }
  
  // public async updateList() {
  //   let list = sp.web.lists.getByTitle(Variables.listas.AdmSolicitudCreditoHipotecario);

  //   const i = await list.items.getById(1).update({
  //     Title: "My New Title",
  //     Description: "Here is a new description"
  //   });
  // }


}
