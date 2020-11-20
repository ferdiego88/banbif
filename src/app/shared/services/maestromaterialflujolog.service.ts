import { Injectable } from '@angular/core';

import { sp } from '@pnp/sp';
import { IList } from '@pnp/sp/lists';
import { Item, PagedItemCollection } from '@pnp/sp/items';
import { Web } from '@pnp/sp/webs';

import { environment } from 'src/environments/environment';
import { Variables } from '../variables';
import { MaestroMaterialFlujoLog } from '../models/fisics/MaestroMaterialFlujoLog';

@Injectable({
  providedIn: 'root'
})
export class MaestromaterialflujologService {
  
  listaMaestroMaterialFlujoLog: IList;

  constructor() { 
    sp.setup({
      sp: {
        baseUrl: `${environment.proxyUrl}${environment.webRelativeUrl}`
      }
    });

    this.listaMaestroMaterialFlujoLog = sp.web.lists.getByTitle(Variables.lists.MaestroMaterialFlujoLog);
  }

  // async getItemsByMaestroMaterialId( maestroMaterialId: number ): Promise<PagedItemCollection<MaestroMaterialFlujoLog[]>> {
  async getItemsByMaestroMaterialId( maestroMaterialId: number ): Promise<MaestroMaterialFlujoLog[]> {

    const expandFields = MaestroMaterialFlujoLog.getColumnasExpand();
    const selectFields = MaestroMaterialFlujoLog.getColumnasSelect();

    const items = await this.listaMaestroMaterialFlujoLog.items.expand(...expandFields).select(...selectFields).filter(`MaestroMaterialId eq ${maestroMaterialId.toString()}`)
    // .top(5)
    // .getPaged().then(p => {
    //   return p;
    // });
    .get();
    console.log(items);
    return items;

  }
}
