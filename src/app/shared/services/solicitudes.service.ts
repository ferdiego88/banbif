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
    solicitante = false
  ): Promise<PagedItemCollection<any[]>> {
   
    debugger;
    const selectFields = EBandejaSolicitud.getColumnasSelect();
    const expandFields = EBandejaSolicitud.getColumnasExpand();

    let query = this.listaSolicitudes.items.expand(...expandFields).select(...selectFields);
  
    let filterArr = [];

    if (solicitante) filterArr.push(`(${Variables.columnasSolicitud.Author}/Id  eq ${usuario.Id})`);

    if (filter) {

      if (filter.NombreTitular && filter.NombreTitular.trim()) {
        filterArr.push(`(substringof('${filter.NombreTitular}',${Variables.columnasSolicitud.NombreTitular}))`);
      }

      if (filter.TipoDocumento) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoDocumento}/Id  eq ${filter.TipoDocumento})`);
      }

      if (filter.NumeroDocumento && filter.NumeroDocumento.trim()) {
        filterArr.push(`(substringof('${filter.NumeroDocumento}',${Variables.columnasSolicitud.NumeroDocumento}))`);
      }

      if (filter.TipoProducto) {
        filterArr.push(`(${Variables.columnasSolicitud.TipoProducto}/Id  eq ${filter.TipoProducto})`);
      }

      if (filter.Estado) {
        filterArr.push(`(${Variables.columnasSolicitud.Estado}/Id  eq ${filter.Estado})`);
      }

      if (filter.Moneda) {
        filterArr.push(`(${Variables.columnasSolicitud.Moneda}/Id  eq ${filter.Moneda})`);
      }

      if (filter.ModalidadPago) {
        filterArr.push(`(${Variables.columnasSolicitud.ModalidadPago}/Id  eq ${filter.ModalidadPago})`);
      }

      if (filter.Financiamiento) {
        filterArr.push(`(${Variables.columnasSolicitud.Financiamiento}/Id  eq ${filter.Financiamiento})`);
      }

      if (filter.Zona) {
        filterArr.push(`(${Variables.columnasSolicitud.Zona}/Id  eq ${filter.Zona})`);
      }

      if (filter.Oficina) {
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

      if (filter.FechaEstado) {
        const fechaDesde = moment(filter.FechaEstado).format('YYYY-MM-DDT') + '00:00:00.000Z';
        filterArr.push(`(datetime'${fechaDesde}' lt ${Variables.columnasSolicitud.FechaEstado})`);
     
        const fechaHasta = moment(filter.FechaEstado).format('YYYY-MM-DDT') + '23:59:59.000Z';
        filterArr.push(`(datetime'${fechaHasta}' ge ${Variables.columnasSolicitud.FechaEstado})`);
      }

      /*if (filter.Etapa && filter.Etapa.length) {
        filterArr.push(`(${filter.Etapa.map(x => `(${Variables.columns.MaestroFLujoEtapa}/Id eq '${x}')`).join(" or ")})`);
      }*/
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

}
