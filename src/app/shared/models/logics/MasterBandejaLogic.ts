import { User } from '../fisics/base/User';
import { Lookup } from '../fisics/base/Lookup';

export class MasterBandejaLogic {
  currentUser: User;
  maestroEstado: Lookup[];
  maestroTipoProducto: Lookup[];
  maestroOficina: Lookup[];
  PertenceGrupo_U_Oficina: boolean;
  PertenceGrupo_U_ReemplazoOficina: boolean;
  PertenceGrupo_U_CPM: boolean;
  PertenceGrupo_U_Asignacion_Riesgos: boolean;
  PertenceGrupo_U_Evaluacion: boolean;
  PertenceGrupo_U_Reasignador_Riesgos: boolean;
  PertenceGrupo_U_Verificacion_Riesgos: boolean;
  isDatos: boolean;

  constructor() {
    this.currentUser = new User();
    this.maestroEstado = [];
    this.maestroTipoProducto = [];
    this.maestroOficina = [];
    this.PertenceGrupo_U_Oficina = false;
    this.PertenceGrupo_U_ReemplazoOficina = false;
    this.PertenceGrupo_U_CPM = false;
    this.PertenceGrupo_U_Asignacion_Riesgos = false;
    this.PertenceGrupo_U_Evaluacion = false;
    this.PertenceGrupo_U_Reasignador_Riesgos = false;
    this.PertenceGrupo_U_Verificacion_Riesgos = false;
    this.isDatos = false;
  }
}
