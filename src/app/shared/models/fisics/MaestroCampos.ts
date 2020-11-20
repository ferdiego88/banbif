import { User } from './base/User';
import { ListItem } from './base/ListItem';
import { Variables, SPParse } from '../../variables';
import { Lookup } from './base/Lookup';
import { RestFiltros } from '../../RestFiltros';
import { ProductProposalStatus } from './State';
import { ProjectType } from './ProjectType';

export class MaestroCampos extends ListItem {
  Titulo: string;
  GruposParticipantes: [];
  Seccion: string;
  MaestroFlujoEtapa: [];

  constructor(
    public Texto = '',
    public OrdenCampo = 0,
    public DesplegableCampo = '',
    public ListaCampo = '',
    public TextoLargo = ''
  ) {
    super();  
    this.Title = '';
    this.GruposParticipantes = [];
    this.Seccion = '';
    this.MaestroFlujoEtapa = [];
  }

  public static setNuevoElemento(
    titulo: string,
    gruposParticipantes: []
  ): MaestroCampos {
    const objeto = new MaestroCampos();
    objeto.GruposParticipantes =  gruposParticipantes;    
    objeto.Title = titulo;  
    return objeto;
  }
  
  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.ID,
      Variables.columns.Title,
      Variables.columns.GruposParticipantes + '/' + Variables.columns.Title,
      Variables.columns.Seccion,
      Variables.columns.Texto,
      Variables.columns.OrdenCampo,
      Variables.columns.DesplegableCampo,
      Variables.columns.ListaCampo,
      Variables.columns.TextoLargo,
      Variables.columns.MaestroFlujoEtapa + '/' + Variables.columns.Id,
      Variables.columns.MaestroFlujoEtapa + '/' + Variables.columns.Title,
      // '*'
    ];
  }

  public static parseJson(element: any): MaestroCampos {
    const objeto = new MaestroCampos();
    objeto.Id = SPParse.getNumber(element[Variables.columns.ID]);
    objeto.Title = SPParse.getString(element[Variables.columns.Title]);
    objeto.GruposParticipantes = element[Variables.columns.Valor];
    return objeto;
  }

  public static parseJsonList(list: any): MaestroCampos[] {
    const listaCampos: MaestroCampos[] = [];
   
    list.forEach(
      item => {
        const objeto = new MaestroCampos();
        objeto.Id = SPParse.getNumber(item[Variables.columns.ID]);
        objeto.Title = SPParse.getString(item[Variables.columns.Title]);
        objeto.GruposParticipantes = item[Variables.columns.GruposParticipantes];
        listaCampos.push(objeto);
      }
    );
       
    return listaCampos;
  }

  public static getColumnasExpand(): string[] {
    const campos = [
      Variables.columns.GruposParticipantes,
      Variables.columns.MaestroFlujoEtapa
    ];

    const uniques = [...new Set(campos)];
    return uniques;
  }

  public getJsonElemento(): any {
    const datos = {};

    datos[Variables.columns.Valor] = this.GruposParticipantes;
    datos[Variables.columns.Title] = this.Title;

    return datos;
  }

}
