import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { sp } from '@pnp/sp';
import { IList } from '@pnp/sp/lists';
import { IEmailProperties } from '@pnp/sp/sputilities';
import { Variables } from '../variables';
import { Log } from '../models/fisics/Log';
import { from, Observable, BehaviorSubject, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { MasterBandejaLogic } from '../models/logics/MasterBandejaLogic';
import { UserService } from './user.service';
import { MaestroMaterial } from '../models/fisics/MaestroMaterial';
import { AbstractControl } from '@angular/forms';
import { Lookup } from '../models/fisics/base/Lookup';
import { Deferred } from 'ts-deferred';

declare var $:any;

@Injectable({
  providedIn: 'root',
})
export class MasterBandejaService {

  private listaMaestroEstado: IList;
  private listaMaestroTipoProducto: IList;
  private listaMaestroOficina: IList;
  private listaMaestroZona: IList;

  constructor(
    public userService: UserService
  ) {
    sp.setup({
      sp: {

        baseUrl: `${environment.proxyUrl}${environment.webRelativeUrl}`,
      },
    });

    this.listaMaestroEstado = sp.web.lists.getByTitle(Variables.listas.AdmEstado);
    this.listaMaestroTipoProducto = sp.web.lists.getByTitle(Variables.listas.AdmTipoProducto);
    this.listaMaestroOficina = sp.web.lists.getByTitle(Variables.listas.AdmOficina);
    this.listaMaestroZona = sp.web.lists.getByTitle(Variables.listas.AdmZona);
  }

  public async getDatosMaestros(): Promise<any> {
   
    const d: Deferred<any> = new Deferred<any>();

    let masterData = new MasterBandejaLogic();
    const listaPromesas: Promise<any>[] = [];

    listaPromesas.push(this.userService.getCurrentUser());
    listaPromesas.push(this.getMaestroEstado());
    listaPromesas.push(this.getMaestroTipoProducto());
    listaPromesas.push(this.getMaestroOficina());
    listaPromesas.push(this.getMaestroZona());

    Promise.all(listaPromesas).then((results) => {
      let cont = 0;
      masterData.isDatos = true;

      masterData.currentUser = results[cont++];
      masterData.maestroEstado = results[cont++];
      masterData.maestroTipoProducto = results[cont++];
      masterData.maestroOficina = results[cont++];
      masterData.maestroZona = results[cont++];

      masterData.PertenceGrupo_U_Oficina = masterData.currentUser.Groups.filter(x => x.Title === "U_Oficina").length > 0;
      masterData.PertenceGrupo_U_ReemplazoOficina = masterData.currentUser.Groups.filter(x => x.Title === "U_ReemplazoOficina").length > 0;
      masterData.PertenceGrupo_U_CPM = masterData.currentUser.Groups.filter(x => x.Title === "U_CPM").length > 0;
      masterData.PertenceGrupo_U_Asignacion_Riesgos = masterData.currentUser.Groups.filter(x => x.Title === "U_Asignacion_Riesgos").length > 0;
      masterData.PertenceGrupo_U_Evaluacion = masterData.currentUser.Groups.filter(x => x.Title === "U_Evaluacion").length > 0;
      masterData.PertenceGrupo_U_Reasignador_Riesgos = masterData.currentUser.Groups.filter(x => x.Title === "U_Reasignador_Riesgos").length > 0;
      masterData.PertenceGrupo_U_Verificacion_Riesgos = masterData.currentUser.Groups.filter(x => x.Title === "U_Verificacion_Riesgos").length > 0;

      d.resolve(masterData);
    });

    return d.promise;
  }

  async getMaestroEstado(): Promise<Lookup[]> {
    const selectFields = ["ID","Title"];
    let result: Array<any>;
    let item = this.listaMaestroEstado.items;
    result = await item.select(...selectFields).filter("Activo eq 1").orderBy("Title").top(4999).get();

    const items: Lookup[] = result.map(elemento => {
      const item = new Lookup();
      item.Id = elemento.Id;
      item.Title = elemento.Title;
      return item
    });

    return items;
  }

  async getMaestroTipoProducto(): Promise<Lookup[]> {
    const selectFields = ["ID","Title"];
    let result: Array<any>;
    let item = this.listaMaestroTipoProducto.items;
    result = await item.select(...selectFields).orderBy("Title").top(4999).get();

    const items: Lookup[] = result.map(elemento => {
      const item = new Lookup();
      item.Id = elemento.Id;
      item.Title = elemento.Title;
      return item
    });

    return items;
  }

  async getMaestroOficina(): Promise<Lookup[]> {
    const selectFields = ["ID","Title"];
    let result: Array<any>;
    let item = this.listaMaestroOficina.items;
    result = await item.select(...selectFields).orderBy("Title").top(4999).get();

    const items: Lookup[] = result.map(elemento => {
      const item = new Lookup();
      item.Id = elemento.Id;
      item.Title = elemento.Title;
      return item
    });

    return items;
  }

  async getMaestroZona(): Promise<Lookup[]> {
    const selectFields = ["ID","Title"];
    let result: Array<any>;
    let item = this.listaMaestroZona.items;
    result = await item.select(...selectFields).orderBy("Title").top(4999).get();

    const items: Lookup[] = result.map(elemento => {
      const item = new Lookup();
      item.Id = elemento.Id;
      item.Title = elemento.Title;
      return item
    });

    return items;
  }

}
