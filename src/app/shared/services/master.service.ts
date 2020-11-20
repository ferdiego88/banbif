import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';
import { Item, IItemAddResult, IItemUpdateResult } from '@pnp/sp/items';
import { IEmailProperties } from '@pnp/sp/sputilities';
//import "@pnp/polyfill-ie11";
import { Variables } from '../variables';

import { MasterData } from '../models/fisics/MasterData';
import { RolType } from '../models/fisics/RolType';
import { Configuration } from '../models/fisics/Configuration';
import { IdGroup } from '../models/fisics/IdGroup';
import { Log } from '../models/fisics/Log';

import { ContentTypeMasterData, State } from '../models/fisics/State';
import { MailTemplate } from '../models/fisics/MailTemplate';
import { SentEmail } from '../models/fisics/SentEmail';
import { from, Observable, BehaviorSubject, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { Deferred } from 'ts-deferred';
import { UsuarioConsultado } from '../variables';
import { ProjectType } from '../models/fisics/ProjectType';
import { EmailFormat } from '../models/fisics/EmailFormat';
//import * as $ from 'jquery';
import { IListItemTransaccional } from '../models/fisics/base/IListItemTransaccional';
import { MasterLogic } from '../models/logics/MasterLogic';
import { UserService } from './user.service';

import { MaestroDesplegables } from '../models/fisics/MaestroDesplegables';
import { MaestroParametros } from '../models/fisics/MaestroParametros';
import { Group } from '../models/fisics/base/Group';
import { User } from '../models/fisics/base/User';

import { MaestroCampos } from '../models/fisics/MaestroCampos';
import { MaestroFLujoEtapa } from '../models/fisics/MaestroFLujoEtapa';

const cacheBuster$ = new Subject<void>();
declare var $:any;
//import {Promise} from 'promise-polyfill';
import { MaestroMaterial } from '../models/fisics/MaestroMaterial';
import { IFields, IFieldInfo } from '@pnp/sp/fields';
import { List } from 'linqts';
import { ListItem } from '../models/fisics/base/ListItem';
import { MaestroLinea } from '../models/fisics/MaestroLinea';
import { AbstractControl } from '@angular/forms';
import { MaestroMaterialDocs } from '../models/fisics/MaestroMaterialDocs';
import { MaestroMaterialDocsService } from './maestro-material-docs.service';

@Injectable({
  providedIn: 'root',
})
export class MasterService {

  private listaMaestroDesplegable: IList;
  private listaMaestroParametros: IList;
  private listaMaestroCampos: IList;
  private listaMaestroFLujoEtapa: IList;
  private listaMaestroLinea: IList;
  private listaMaestroProveedores: IList;
  constructor(
    public userService: UserService,
    private maestroMaterialDocsService: MaestroMaterialDocsService
  ) {
    sp.setup({
      ie11: true,
      // only needed when working within SharePoint Framework
      //spfxContext: this.context,
      sp: {

        baseUrl: `${environment.proxyUrl}${environment.webRelativeUrl}`,
      },
    });

    this.listaMaestroLinea = sp.web.lists.getByTitle(Variables.lists.MaestroLinea);
    this.listaMaestroProveedores = sp.web.lists.getByTitle(Variables.lists.MaestroProveedores);



    this.listaMaestroDesplegable = sp.web.lists.getByTitle(Variables.lists.MaestroDesplegables);
    this.listaMaestroParametros = sp.web.lists.getByTitle(Variables.lists.MaestroParametros);
    this.listaMaestroCampos = sp.web.lists.getByTitle(Variables.lists.MaestroCampos);
    this.listaMaestroFLujoEtapa = sp.web.lists.getByTitle(Variables.lists.MaestroFLujoEtapa);
  }

  // maskDecimal( numero: number, decimalMask: number) {
  //   const[entero, decimales] = numero.toString().split('.');

  //   if( decimales === undefined || decimales.length <= decimalMask ) {
  //     console.log(false);
  //     return numero;
  //   } else {
  //     console.log(true);
  //     const decimalesString = decimales.substring(0, decimalMask);
  //     return +(entero + '.' + decimalesString);
  //   }
  // }

  maskDecimal( control: AbstractControl, decimalMask: number) {
    if (control.value !== null) {
      const[entero, decimales] = control.value.toString().split('.');

      if (decimales !== undefined && decimales.length > decimalMask) {
        console.log(true);
        const decimalesString = decimales.substring(0, decimalMask);
        control.setValue( +(entero + '.' + decimalesString) );
      }
    }
  }

  async enviarCorreo( obj: IEmailProperties ) {
    const correo: IEmailProperties = obj;
    return await sp.utility.sendEmail( correo );
  }

  setObject(obj: {}, objCopy: {}) {
    for (const prop in obj) {
      if (objCopy[prop] !== undefined && objCopy[prop] !== null) obj[prop] = objCopy[prop];
    }
  }

  newObject( objCopy: {}) {

    const newObj = {};

    for( const prop in objCopy ) {
      newObj[prop] = objCopy[prop];
    }

    return newObj;
  }

  modObject( objMod: {}, objModel: {} ) {
    for (const prop in objMod) {
      if (objModel[prop] === undefined) {
        delete objMod[prop];
      } else {

        // console.log(prop.toString());
        // console.log(typeof objModel[prop]);
        switch (typeof objModel[prop]) {
          case 'number':
            objMod[prop] = +objMod[prop];
            break;

          // default:
          //   break;
        }
      }
    }
  }

  async getMaestroMaterial( idMaestroMaterial: number ) {
    // debugger;
    const expandFields = MaestroMaterial.getColumnasExpand();
    const selectFields = MaestroMaterial.getColumnasSelectSingle();
    let item = await sp.web.lists.getByTitle( Variables.lists.MaestroMaterial).items
    .expand(...expandFields).select(...selectFields).filter("Id eq " + idMaestroMaterial.toString())
    .top(1)
      .getPaged().then(p => {

        return p;
      });
    // console.log('item material');
    // console.log(item);
    return item.results[0];
  }

  async getEstructuraLista( lista: string ) {

    // return await sp.web.lists.getByTitle( Variables.lists.MaestroMaterial ).items.getById( idMaestroMaterial ).get();
    const estructuraLista = await sp.web.lists.getByTitle( lista ).fields();
    const estructuraListaFilter = new List<IFieldInfo>( estructuraLista ).Where( field => !field.ReadOnlyField).ToArray();
    // console.log(estructuraListaFilter);
    // console.log(estructuraListaFilter[0]);
    return estructuraListaFilter;

  }

  async addMaestroMaterial(item: {}, comentarioSE){

    const iar: IItemAddResult = await sp.web.lists.getByTitle(Variables.lists.MaestroMaterial).items.add(
      item
    );

    console.log(iar);

    const itemMaestroMaterialFlujoLog = {
      Title: iar.data.Title,
      MaestroMaterialId: iar.data.Id,
      MaestroFlujoEtapaId: iar.data.MaestroFLujoEtapaId,
      Comentarios: comentarioSE,
      JsonFormulario: JSON.stringify(item),
      JsonFormularioSP: JSON.stringify(iar),
      EnBorrador: iar.data.EnBorrador
    };

    const iarLog: IItemAddResult = await sp.web.lists.getByTitle(Variables.lists.MaestroMaterialFlujoLog).items.add(
      itemMaestroMaterialFlujoLog
    );

    console.log(iarLog);
    //Buscar responsables de la siguiente etapa / Grupo


    //Notificar a los responsables de la siguiente etapa:
    //iar.Id
    // console.log(iar);
    return iar;
  }

  async guardarMaestroMaterial(
    id: number, itemSave: {}, comentarioSE: string, modified: string, maestroFlujoEtapaIdLog: number,
    maestroMaterialDocs?: MaestroMaterialDocs[], usuarios?: any[]
  ): Promise<IItemAddResult | boolean>{

    let valid = true;

    let iar: IItemAddResult;

    if (id === 0){
      iar = await sp.web.lists.getByTitle(Variables.lists.MaestroMaterial).items.add(
        itemSave
      );
    } else {

      await this.getMaestroMaterial( id ).then(
        (data: any) => {
          console.log(data.Modified);
          console.log(modified);
          if (modified !== data.Modified) { // Si no pasa la validación mostramos mensaje y ya no grabamos
            valid = false;
          }
        }
      );

      if (valid) {// Una vez pasada la validación recién grabamos
        iar = await sp.web.lists.getByTitle(Variables.lists.MaestroMaterial).items.getById( id ).update(
          itemSave
        );
      }
    }

    if (valid) {

      console.log(iar);

      const maestroMaterialIdSave = id === 0 ? iar.data.Id : id;

      //Guarda MaterObjetosPermiso
      const grupo = await sp.web.siteGroups.getByName( Variables.Grupos.Administradores )();
      const grupos = [grupo.Id];
      // const iarMasterObjetosPermiso =
      await sp.web.lists.getByTitle(Variables.lists.MasterObjetosPermiso).items.add(
        {
          Title: `${Variables.lists.MaestroMaterial}-${maestroMaterialIdSave}`,
          Lista: Variables.lists.MaestroMaterial,
          TipoObjeto: Variables.constantes.Lista,
          IdElemento: maestroMaterialIdSave,
          UsuariosId: {results: usuarios},
          GruposId: {results: grupos},
          Rol: Variables.columns.RolMaterialesSolicitantes,
          AplicoPermiso: false
        }
      );

      // console.log({iarMasterObjetosPermiso});
      //Guarda MaestroMaterialDocs

      if (maestroMaterialDocs) {
        await this.maestroMaterialDocsService.guardar(maestroMaterialIdSave, maestroMaterialDocs, grupos, usuarios);
      }

      const itemMaestroMaterialFlujoLog = {
        Title: iar.data.Title,
        MaestroMaterialId: maestroMaterialIdSave,
        MaestroFlujoEtapaId: maestroFlujoEtapaIdLog, // itemSave['MaestroFLujoEtapaId'],// iar.data.MaestroFLujoEtapaId,
        Comentarios: comentarioSE,
        JsonFormulario: JSON.stringify(itemSave),
        JsonFormularioSP: JSON.stringify(iar),
        EnBorrador: iar.data.EnBorrador
      };

      const iarLog: IItemAddResult = await sp.web.lists.getByTitle(Variables.lists.MaestroMaterialFlujoLog).items.add(
        itemMaestroMaterialFlujoLog
      );

      console.log(iarLog);

      await sp.web.lists.getByTitle(Variables.lists.MasterObjetosPermiso).items.add(
        {
          Title: `${Variables.lists.MaestroMaterialFlujoLog}-${iarLog.data.Id}`,
          Lista: Variables.lists.MaestroMaterialFlujoLog,
          TipoObjeto: Variables.constantes.Lista,
          IdElemento: iarLog.data.Id,
          UsuariosId: {results: usuarios},
          GruposId: {results: grupos},
          Rol: Variables.columns.RolMaterialesSolicitantes,
          AplicoPermiso: false
        }
      );
      // Buscar responsables de la siguiente etapa / Grupo


      // Notificar a los responsables de la siguiente etapa:
      // iar.Id
      // console.log(iar);
      return iar;

    } else {
      return false;
    }
  }

  async addMaestroMaterialFlujoLog(item){

    const iar: IItemAddResult = await sp.web.lists.getByTitle(Variables.lists.MaestroMaterialFlujoLog).items.add(
      item
    );

    //Buscar responsables de la siguiente etapa / Grupo
    //Notificar a los responsables de la siguiente etapa:
    //iar.Id
    // console.log(iar);
    return iar;
  }

  async guardarLog(elemento: Log): Promise<boolean> {
    try {
      const lista = sp.web.lists.getByTitle(Variables.lists.Log);
      const datos = elemento.getJsonElemento();

      await lista.items.add(datos);

      return true;
    } catch (error) {
      console.dir(error);
      throw error;
    }
  }

  async guardarSendEmail(elemento: SentEmail): Promise<void> {
    try {
      const lista = sp.web.lists.getByTitle(Variables.lists.SentEmails);
      const datos = elemento.getJsonElemento();

      await lista.items.add(datos);
    } catch (error) {
      console.dir(error);
      throw error;
    }
  }

  async guardarSendEmails(elementos: SentEmail[]): Promise<void> {
    var dfd = $.Deferred();

    try {
      const lista = sp.web.lists.getByTitle(Variables.lists.SentEmails);
      const promises = [];

      elementos.forEach((elemento: SentEmail) => {
        const datos = elemento.getJsonElemento();
        promises.push(lista.items.add(datos));
      });

      $.when
        .apply($, promises)
        .done(function () {
          dfd.resolve(true);
        })
        .fail(function (error) {
          dfd.reject(error.get_message());
        });
    } catch (error) {
      dfd.reject(error);
    }

    return dfd.promise();
  }

  @Cacheable({
    cacheBusterObserver: cacheBuster$,
  })
  public getDatosMaestros(): Observable<MasterLogic> {
    let masterData = new MasterLogic();
    const subject = new BehaviorSubject<MasterLogic>(masterData);
    const listaPromesas: Promise<any>[] = [];

    // listaPromesas.push(this.userService.getCurrentUser());
    // listaPromesas.push(this.getMaestroDesplegables());
    // listaPromesas.push(this.getMaestroParametros());

    // listaPromesas.push(this.getUsuariosPorGrupo(Variables.Grupos.GrupoDT));
    // listaPromesas.push(this.getUsuariosPorGrupo(Variables.Grupos.GrupoEECC));
    // listaPromesas.push(this.getUsuariosPorGrupo(Variables.Grupos.GrupoSL));
    // listaPromesas.push(this.getUsuariosPorGrupo(Variables.Grupos.GrupoLAB));
    // listaPromesas.push(this.getUsuariosPorGrupo(Variables.Grupos.GrupoRDM));

    // listaPromesas.push(this.getMaestroCampos());
    // listaPromesas.push(this.getMaestroFLujoEtapas());
    // listaPromesas.push(this.getMaestroLinea());
    // listaPromesas.push(this.getMaestroProveedores());

    Promise.all(listaPromesas).then((results) => {
      let cont = 0;
      masterData.isDatos = true;
      //debugger;
      masterData.currentUser = results[cont++];
      masterData.maestroDesplegables = results[cont++];
      masterData.maestroParametros = results[cont++];

      masterData.GrupoDT = results[cont++];
      masterData.GrupoEECC = results[cont++];
      masterData.GrupoSL = results[cont++];
      masterData.GrupoLAB = results[cont++];
      masterData.GrupoRDM = results[cont++];

      masterData.maestroCampos = results[cont++];
      masterData.maestroFLujoEtapa = results[cont++];
      masterData.maestroLinea = results[cont++];
      masterData.maestroPrveedor = results[cont++];



      console.log(masterData);
      subject.next(masterData);
    });

    return subject.asObservable();
  }

  async getMaestroDesplegables(): Promise<MaestroDesplegables[]> {
    //debugger;
    const selectFields = MaestroDesplegables.getColumnasSelect();
    const expandtFields = MaestroDesplegables.getColumnasExpand();
    let result: Array<any>;
    let item = this.listaMaestroDesplegable.items;
    result = await item.select(...selectFields).expand(...expandtFields).top(4999).get();
   // const registro = MaestroDesplegables.parseJson(result);
    // console.log(result);
    //console.log(registro);
    return result;
  }

  async getMaestroParametros(): Promise<MaestroParametros[]> {
    //debugger;
    const selectFields = MaestroParametros.getColumnasSelect();
    let result: Array<any>;
    let item = this.listaMaestroParametros.items;
    result = await item.select(...selectFields).top(4999).get();
    //const registro = MaestroDesplegables.parseJson(result);
    //console.log(registro);
    return result;
  }

  async getUsuariosPorGrupo(grupoNombre: string): Promise<User[]> {
    const grupos = await sp.web.siteGroups.getByName(grupoNombre).users.get()

    //listaUsuarios = User.parseJsonList(usuarios);
    const listaUsuarios: User[] = grupos.map(element => {
      const user = new User();
      user.Id = element[Variables.columns.Id];
      user.Title = element[Variables.columns.Title];
      user.Email = element[Variables.columns.Email];
      user.Name = element[Variables.columns.Name];
      user.NombreGrupo = grupoNombre;

      return user;
    })

    return listaUsuarios;

  }

  async getMaestroCampos(): Promise<MaestroCampos[]> {
    // debugger;
    const selectFields = MaestroCampos.getColumnasSelect();
    const expandtFields = MaestroCampos.getColumnasExpand();
    let result: Array<any>;
    const item = this.listaMaestroCampos.items;
    result = await item.select(...selectFields).expand(...expandtFields).top(4999).get();
    //const registro = MaestroCampos.parseJsonList(result);
    // console.log(result);
    //console.log(registro);
    return result;
  }

  async getMaestroFLujoEtapas(): Promise<MaestroFLujoEtapa[]> {
    // debugger;
    const selectFields = MaestroFLujoEtapa.getColumnasSelect();
    const expandtFields = MaestroFLujoEtapa.getColumnasExpand();
    let result: Array<any>;
    const item = this.listaMaestroFLujoEtapa.items;
    result = await item.select(...selectFields).expand(...expandtFields).top(4999).get();
    //const registro = MaestroFLujoEtapa.parseJsonList(result);
    // console.log(result);
    //console.log(result);
    return result;
  }

  async getMaestroLinea(): Promise<MaestroLinea[]> {
    // debugger;
    const selectFields = MaestroLinea.getColumnasSelect();
    const expandtFields = MaestroLinea.getColumnasExpand();
    let result: Array<MaestroLinea>;
    const item = this.listaMaestroLinea.items;
    result = await item.select(...selectFields).expand(...expandtFields).top(4999).get();
    //const registro = MaestroFLujoEtapa.parseJsonList(result);
    // console.log(result);
    //console.log(result);
    return result;
  }

  async getMaestroProveedores(): Promise<ListItem[]> {
    // debugger;
    const selectFields = "*";
    let result: Array<any>;
    const item = this.listaMaestroProveedores.items;
    result = await item.select(...selectFields).top(4999).get();
    console.log(result);
    //const registro = MaestroFLujoEtapa.parseJsonList(result);
    // console.log(result);
    //console.log(result);
    return result;
  }

  getFechaActualFormato(): string {
    const date = new Date();
    return this.dateFormat( date );
  }

  dateFormat( date: Date ): string {
    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  async test(): Promise<any[]> {
    const result = await sp.web.lists.getByTitle('Calificacion').items.get();
    return result;
  }

}
