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

  public async getItemById(itemId: any): Promise<any> {
    // return new Promise((resolve, reject) => {
    if (sp !== null && sp !== undefined) {

      const item = await this.listaSolicitudes.items
        .expand(...['Ejecutivo', 'Anlista_Riesgos'])
        .select(...['*', 'Ejecutivo/Title', 'Ejecutivo/Id', 'Anlista_Riesgos/Title', 'Anlista_Riesgos/Id'])
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

    debugger;

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

}
