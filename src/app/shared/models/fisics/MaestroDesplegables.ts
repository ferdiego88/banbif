import { ListItem } from './base/ListItem';
import { Variables, SPParse } from '../../variables';
export class MaestroDesplegables extends ListItem {
    Tipo: string;
    TipoText: string;  
    Id: number;
    Padre: ListItem
    constructor() {
      super();  
      this.Title = '';
      this.Tipo = '';
      this.TipoText = '';
      this.Id = 0
      this.Padre = new ListItem()
    }
  
    public static setNuevoElemento(
      tipo: string,
      titulo: string,
      tipoText: string
    ): MaestroDesplegables {
      const objeto = new MaestroDesplegables();
      objeto.TipoText = 
      objeto.Tipo = tipo;
      objeto.Title = titulo;  
      return objeto;
    }
  
    public getJsonElemento(): any {
      const datos = {};
      datos[Variables.columns.TipoText] = this.TipoText;
      datos[Variables.columns.Tipo] = this.Tipo;
      datos[Variables.columns.Title] = this.Title;
  
      return datos;
    }

    public static getColumnasSelect(): string[] {
        return [
        Variables.columns.ID,
        Variables.columns.Title,
        Variables.columns.TipoText,
        Variables.columns.Tipo,
        Variables.columns.Padre + "/" + Variables.columns.Title,
        Variables.columns.Padre + "/" + Variables.columns.Id
        ]
    }

    public static parseJson(list: any): MaestroDesplegables[] {
    // debugger;
     let listaDesplegables: MaestroDesplegables[] = [];
   
      list.forEach(item => {
        const objeto = new MaestroDesplegables();
      objeto.Id = SPParse.getNumber(item[Variables.columns.ID]);
      objeto.Title = SPParse.getString(item[Variables.columns.Title]);
      objeto.TipoText = SPParse.getString(item[Variables.columns.TipoText]);
      objeto.Tipo = SPParse.getString(item[Variables.columns.Tipo]);
      if(item["Padre"] != null){

      
      objeto.Padre.Id = SPParse.getNumber(item["Padre"]["Id"]);
      objeto.Padre.Title = SPParse.getString(item["Padre"]["Title"]);
    }
      listaDesplegables.push(objeto);

     });
       
      return listaDesplegables
    }

    public static getColumnasExpand(): string[] {
      const campos = [Variables.columns.Padre]

      const uniques = [...new Set(campos)];
      return uniques;
  }
  }