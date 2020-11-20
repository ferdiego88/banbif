import { User } from './base/User';
import { ListItem } from './base/ListItem';
import { Variables, SPParse } from '../../variables';
import { Lookup } from './base/Lookup';
import { RestFiltros } from '../../RestFiltros';
import { ProductProposalStatus } from './State';
import { ProjectType } from './ProjectType';
//import { User } from './base/User';


export class MaestroLinea extends ListItem {
    Titulo: string;
    MaestroProveedor: ListItem; 
    EECC: User;  
    LAB: User;  
    DT: User;  
    RDM: User;  
    Categoria: string;  

    constructor() {
      super();  
      this.Title = '';
      this.EECC = new User();
      this.LAB = new User();
      this.DT = new User();
      this.RDM = new User();
      this.MaestroProveedor = new ListItem();

    }
  
    public static getColumnasSelect(): string[] {
        return [
        Variables.columns.ID,
        Variables.columns.Title,
        Variables.columns.MaestroProveedor + "/" + Variables.columns.Title,

        Variables.columns.EECC + "/" + Variables.columns.Title,
        Variables.columns.EECC + "/" + Variables.columns.EMail,
        Variables.columns.EECC + "/" + Variables.columns.Id,
        Variables.columns.LAB + "/" + Variables.columns.Title,
        Variables.columns.LAB + "/" + Variables.columns.EMail,
        Variables.columns.LAB + "/" + Variables.columns.Id,
        Variables.columns.DT + "/" + Variables.columns.Title,
        Variables.columns.DT + "/" + Variables.columns.EMail,
        Variables.columns.DT + "/" + Variables.columns.Id,
        Variables.columns.RDM + "/" + Variables.columns.Title,
        Variables.columns.RDM + "/" + Variables.columns.EMail,
        Variables.columns.RDM + "/" + Variables.columns.Id,

        Variables.columns.Categoria
        ]
    }

    public static parseJson(element: any): MaestroLinea {
        const objeto = new MaestroLinea();
       /* objeto.Id = SPParse.getNumber(element[Variables.columns.ID]);
        objeto.Title = SPParse.getString(element[Variables.columns.Title]);
        objeto.GruposParticipantes = element[Variables.columns.Valor];*/
        return objeto;
    }


    public static getColumnasExpand(): string[] {
      const campos = [ 
        Variables.columns.MaestroProveedor ,    
        Variables.columns.EECC ,  
        
        Variables.columns.LAB ,
 

        Variables.columns.DT ,
   

        Variables.columns.RDM ]
      const uniques = [...new Set(campos)];
      return uniques;
  }
  }