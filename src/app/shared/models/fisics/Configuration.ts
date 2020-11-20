import { ListItemMaster } from './base/ListItemMaster';
import { Variables } from '../../variables';
import { RestFiltros } from '../../RestFiltros';
import { Group } from './base/Group';

export class Configuration extends ListItemMaster {
  administratorsGroup: Group;
  documentOwnersGroup: Group;
  sendMailGroupTypeG2: boolean;
  showDaysAlertExpiration: number;
  showButtonViewEvaluation: boolean;
  pathSavePdfEvaluators: string;
  constructor() {
    super();

    this.administratorsGroup = new Group();
    this.documentOwnersGroup = new Group();
    this.sendMailGroupTypeG2 = false;
    this.showDaysAlertExpiration = 2;
    this.showButtonViewEvaluation = false;
    this.pathSavePdfEvaluators = 'PathSavePdfEvaluators';
  }

  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.ID,
      RestFiltros.obtenerFieldExpandUsuario(
        Variables.columns.AdministratorsGroup
      ),
      RestFiltros.obtenerFieldExpandUsuario(
        Variables.columns.DocumentOwnersGroup
      ),
      Variables.columns.SendMailGroupTypeG2,
      Variables.columns.ShowDaysAlertExpiration,
      Variables.columns.ShowButtonViewEvaluation,
      Variables.columns.PathSavePdfEvaluators,
    ];
  }

  public static getColumnasExpand(): string[] {
    return [
      Variables.columns.AdministratorsGroup,
      Variables.columns.DocumentOwnersGroup,
    ];
  }

  public static parseJson(element: any): Configuration {
    const objeto = new Configuration();
    objeto.Id = element[Variables.columns.ID];
    objeto.administratorsGroup = Group.parseJson(
      element[Variables.columns.AdministratorsGroup]
    );
    objeto.documentOwnersGroup = Group.parseJson(
      element[Variables.columns.DocumentOwnersGroup]
    );
    objeto.sendMailGroupTypeG2 = element[Variables.columns.SendMailGroupTypeG2];
    objeto.showDaysAlertExpiration =
      element[Variables.columns.ShowDaysAlertExpiration];
    objeto.showButtonViewEvaluation =
      element[Variables.columns.ShowButtonViewEvaluation];
    objeto.pathSavePdfEvaluators =
      element[Variables.columns.PathSavePdfEvaluators];
    return objeto;
  }
}
