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
import { EFiltroSeguimientoSolicitud } from '../models/fisics/EFiltroSeguimientoSolicitud';
import * as moment from 'moment';
import { EBandejaSeguimientoSolicitud } from '../models/fisics/EBandejaSeguimientoSolicitud';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SeguimientoSolicitudesService {

  private listaSeguimiento: IList;

  constructor() {
    sp.setup({
      sp: {
        baseUrl: `${environment.proxyUrl}${environment.webRelativeUrl}`
      }
    });

    this.listaSeguimiento = sp.web.lists.getByTitle(Variables.listas.FlujoSeguimientoEtapa);
  }

  async getBandejaSeguimientoSolicitudes(
    filter: EFiltroSeguimientoSolicitud,
    orderBy: string,
    ascending: boolean,
    pagesize: number
  ): Promise<PagedItemCollection<any[]>> {

    const selectFields = EBandejaSeguimientoSolicitud.getColumnasSelect();
    const expandFields = EBandejaSeguimientoSolicitud.getColumnasExpand();

    let query = this.listaSeguimiento.items.expand(...expandFields).select(...selectFields);

    let filterArr = [];

    debugger;

    if (filter) {


      if (filter.Estado && filter.Estado.length) {
        filterArr.push(`(${filter.Estado.map(x => `(${Variables.columnasSeguimiento.Estado}/Id eq '${x}')`).join(" or ")})`);
      }

      if (filter.EstadoLegal && filter.EstadoLegal.length) {
        filterArr.push(`(${filter.EstadoLegal.map(x => `(${Variables.columnasSeguimiento.EstadoLegal}/Id eq '${x}')`).join(" or ")})`);
      }

      if (filter.EstadoMiVivienda && filter.EstadoMiVivienda.length) {
        filterArr.push(`(${filter.EstadoMiVivienda.map(x => `(${Variables.columnasSeguimiento.EstadoMiVivienda}/Id eq '${x}')`).join(" or ")})`);
      }

      if (filter.SolicitudHipotecario && filter.SolicitudHipotecario.length > 0) {
        filterArr.push(`(${Variables.columnasSeguimiento.SolicitudHipotecario}/Id eq ${filter.SolicitudHipotecario})`);
      }

      if (filter.NombreTitular && filter.NombreTitular.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NombreTitular.trim()}',${Variables.columnasSeguimiento.NombreTitular}))`);
      }

      if (filter.NumeroDocumento && filter.NumeroDocumento.trim().length > 0) {
        filterArr.push(`(substringof('${filter.NumeroDocumento.trim()}',${Variables.columnasSeguimiento.NumeroDocumento}))`);
      }
    }

    query = query.filter(filterArr.join(" and "));

    if (orderBy != undefined && orderBy.length > 0) {
      query = query.orderBy(orderBy, ascending);
      query = query.orderBy("Created", false);
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
