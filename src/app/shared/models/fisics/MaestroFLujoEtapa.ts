import { ListItem } from './base/ListItem';
import { Variables, SPParse } from '../../variables';
export class MaestroFLujoEtapa  extends ListItem {
  Titulo: string;
  Codigo: string;
  GruposParticipantes: [];
  Abreviatura: string;
  Rechazo: number;
  IdEtapaSiguienteEspecificacionTe: number;
  CargaDocumentos: boolean;
  IdEtapaSiguiente: number;
  EtapaHabilitado: boolean;

  constructor() {
    super();  
    this.Title = '';
    this.GruposParticipantes = [];
    this.Codigo = '';
    this.Rechazo = 0;
    this.IdEtapaSiguienteEspecificacionTe = 0;
    this.CargaDocumentos = false;
    this.IdEtapaSiguiente = 0;
    this.EtapaHabilitado = false;
  }

  public static setNuevoElemento(
    titulo: string,
    codigo:string,
    gruposParticipantes: []
  ): MaestroFLujoEtapa {
    const objeto = new MaestroFLujoEtapa();
    objeto.GruposParticipantes =  gruposParticipantes;    
    objeto.Title = titulo;  
    objeto.Codigo = codigo;
    return objeto;
  }

  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.ID,
      Variables.columns.Title,
      Variables.columns.Codigo,
      Variables.columns.GruposParticipantes + '/' + Variables.columns.Title,
      Variables.columns.Abreviatura,
      Variables.columns.Rechazo,
      Variables.columns.IdEtapaSiguienteEspecificacionTe,
      Variables.columns.CargaDocumentos,
      Variables.columns.IdEtapaSiguiente,
      Variables.columns.EtapaHabilitado
    ];
  }

  public static parseJson(element: any): MaestroFLujoEtapa {
      const objeto = new MaestroFLujoEtapa();
      objeto.Id = SPParse.getNumber(element[Variables.columns.ID]);
      objeto.Title = SPParse.getString(element[Variables.columns.Title]);
      objeto.Codigo = SPParse.getString(element[Variables.columns.Codigo]);
      objeto.GruposParticipantes = element[Variables.columns.Valor];
      return objeto;
  }

  public static parseJsonList(list: any): MaestroFLujoEtapa[] {
    // debugger;
      let listaCampos: MaestroFLujoEtapa[] = [];
    
      list.forEach(item => {
        const objeto = new MaestroFLujoEtapa();
      objeto.Id = SPParse.getNumber(item[Variables.columns.ID]);
      objeto.Title = SPParse.getString(item[Variables.columns.Title]);
      objeto.GruposParticipantes = item[Variables.columns.GruposParticipantes];
      objeto.Codigo = item[Variables.columns.Codigo];
      listaCampos.push(objeto);

      });
        
      // tslint:disable-next-line: align
      return listaCampos;
    }

  public static getColumnasExpand(): string[] {
    const campos = [Variables.columns.GruposParticipantes]
    const uniques = [...new Set(campos)];
    return uniques;
  }

  public getJsonElemento(): any {
    const datos = {};

    datos[Variables.columns.GruposParticipantes] = this.GruposParticipantes;
    datos[Variables.columns.Title] = this.Title;
    datos[Variables.columns.Codigo] = this.Codigo;
    return datos;
  }
    
}