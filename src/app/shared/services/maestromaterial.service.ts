import { Injectable } from '@angular/core';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';
import { Item, IItemAddResult, IItemUpdateResult, PagedItemCollection } from '@pnp/sp/items';

import { MaestroMaterial } from '../models/fisics/MaestroMaterial';

import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { Variables } from '../variables';
import { MaestroMaterialFilter } from '../models/fisics/MaestroMaterialFilter';
import { User } from '../models/fisics/base/User';
import { Lookup } from '../models/fisics/base/Lookup';
import { ProductProposalStatus } from '../models/fisics/State';
//import * as $ from 'jquery';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class MaestroMaterialService {

  private listaMaestroMaterial: IList;


  constructor(private userService: UserService,) {
    sp.setup({
      sp: {
        baseUrl: `${environment.proxyUrl}${environment.webRelativeUrl}`
      }
    });

    this.listaMaestroMaterial = sp.web.lists.getByTitle(Variables.lists.MaestroMaterial);

  }

  async getSolicitudMateriales(
    filter: MaestroMaterialFilter,
    orderBy: string,
    ascending: boolean,
    pagesize: number,
    usuario: User,
    administrator = false
  ): Promise<PagedItemCollection<any[]>> {
    // console.log('serviceCall');
    const selectFields = MaestroMaterial.getColumnasSelect();
    const expandFields = MaestroMaterial.getColumnasExpand();

    let query = this.listaMaestroMaterial.items.expand(...expandFields).select(...selectFields);
    // debugger;
    let filterArr = [];
    if (!administrator) filterArr.push(`( (${Variables.columns.CreadoPor}/Id  eq ${usuario.Id}) or (${Variables.columns.ResponsableLaboratorio}/Id  eq ${usuario.Id})  or  (${Variables.columns.EjecutivoComercial}/Id  eq ${usuario.Id}) or  (${Variables.columns.ResponsableDT}/Id  eq ${usuario.Id}) or (${Variables.columns.ResponsableRDM}/Id  eq ${usuario.Id}))`);

    if (filter) {

      if (filter.Title && filter.Title.trim()) {
        filterArr.push(`(substringof('${filter.Title}',${Variables.columns.TextoBreveMaterial}) or substringof('${filter.Title}',${Variables.columns.TextoBreveMaterial}) or substringof('${filter.Title}',${Variables.columns.TextoBreveMaterial}))`);
      }

      if (filter.Etapa && filter.Etapa.length) {
        filterArr.push(`(${filter.Etapa.map(x => `(${Variables.columns.MaestroFLujoEtapa}/Id eq '${x}')`).join(" or ")})`);
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

    // console.log(results);
    return results;
  }





}
