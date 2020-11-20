import { ListItemMaster } from './base/ListItemMaster';
import { Variables } from '../../variables';

export class ProjectType extends ListItemMaster {
  constructor() {
    super();
  }

  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.ID,
      Variables.columns.Title,
      Variables.columns.State,
    ];
  }

  public static parseJson(element: any): ProjectType {
    const objeto = new ProjectType();

    if (element) {
      objeto.Id = element[Variables.columns.ID];
      objeto.Title = this.parseFieldString(element[Variables.columns.Title]);
      objeto.state = this.parseFieldString(element[Variables.columns.State]);
    }

    return objeto;
  }
}
