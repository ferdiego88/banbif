import { ListItemMaster } from './base/ListItemMaster';
import { Variables } from '../../variables';

export class RolType extends ListItemMaster {
  abbreviation: string;

  constructor() {
    super();

    this.abbreviation = '';
  }

  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.Abbreviation,
      Variables.columns.ID,
      Variables.columns.Title,
      Variables.columns.State,
    ];
  }

  public static parseJson(element: any): RolType {
    const objeto = new RolType();
    objeto.abbreviation = element[Variables.columns.Abbreviation];
    objeto.Id = element[Variables.columns.ID];
    objeto.Title = this.parseFieldString(element[Variables.columns.Title]);
    objeto.state = this.parseFieldString(element[Variables.columns.State]);

    return objeto;
  }
}
