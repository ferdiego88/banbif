import { User } from './base/User';
import { ListItem } from './base/ListItem';
import { Variables, SPParse } from '../../variables';
import { Lookup } from './base/Lookup';
import { RestFiltros } from '../../RestFiltros';
import { ProductProposalStatus } from './State';
import { ProjectType } from './ProjectType';

export class MaestroParametros extends ListItem {
    Titulo: string;
    Valor: string;  
    constructor() {
      super();  
      this.Title = '';
      this.Valor = '';
 
    }
  
    public static setNuevoElemento(
      titulo: string,
      valor: string
    ): MaestroParametros {
      const objeto = new MaestroParametros();
      objeto.Valor =  valor;    
      objeto.Title = titulo;  
      return objeto;
    }
  
    public getJsonElemento(): any {
      const datos = {};
  
      datos[Variables.columns.Valor] = this.Valor;
      datos[Variables.columns.Title] = this.Title;
  
      return datos;
    }

    public static getColumnasSelect(): string[] {
        return [
        Variables.columns.ID,
        Variables.columns.Title,
        Variables.columns.Valor
        ]
    }

    public static parseJson(element: any): MaestroParametros {
        const objeto = new MaestroParametros();
        objeto.Id = SPParse.getNumber(element[Variables.columns.ID]);
        objeto.Title = SPParse.getString(element[Variables.columns.Title]);
        objeto.Valor = SPParse.getString(element[Variables.columns.Valor]);      
        return objeto;
    }
  }