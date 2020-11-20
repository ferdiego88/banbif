import { User } from '../fisics/base/User';
import { MasterData } from '../fisics/MasterData';


import { MaestroDesplegables } from '../fisics/MaestroDesplegables';
import { MaestroParametros } from '../fisics/MaestroParametros';
import { Group } from '../fisics/base/Group';
import { MaestroCampos } from '../fisics/MaestroCampos';
import { MaestroFLujoEtapa } from '../fisics/MaestroFLujoEtapa';
import { MaestroLinea } from '../fisics/MaestroLinea';
import { ListItem } from '../fisics/base/ListItem';
export class MasterLogic {
  currentUser: User;
  isDatos: boolean;
  
  masterData: MasterData;
  maestroDesplegables: MaestroDesplegables[];
  maestroParametros: MaestroParametros[];
  GrupoEECC: User[];
  GrupoSL: User[];
  GrupoDT: User[];
  GrupoLAB: User[];
  GrupoRDM: User[];
  maestroCampos: MaestroCampos[];
  maestroFLujoEtapa : MaestroFLujoEtapa[];
  maestroLinea: MaestroLinea[];
  maestroPrveedor: ListItem[];

  constructor() {
    this.currentUser = new User();
    this.isDatos = false;    
    this.masterData = new MasterData();
    this.maestroDesplegables = [];
    this.maestroParametros = [];
    this.GrupoEECC = [];
    this.GrupoSL = [];
    this.GrupoDT = [];
    this.GrupoLAB = [];
    this.GrupoRDM = [];
    this.maestroCampos=[];
    this.maestroFLujoEtapa =  [];
    this.maestroLinea = [];
    this.maestroPrveedor = [];
  }
}
