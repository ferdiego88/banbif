import { ListItemMaster } from './base/ListItemMaster';
import { Variables } from '../../variables';

export class EmailFormat extends ListItemMaster {
  Body: string;

  constructor() {
    super();

    this.Body = '';
  }

  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.Body,
      Variables.columns.ID,
      Variables.columns.Title,
      Variables.columns.State,
    ];
  }

  public static parseJson(element: any): EmailFormat {
    const objeto = new EmailFormat();
    objeto.Body = this.parseFieldString(element[Variables.columns.Body]);
    objeto.Id = element[Variables.columns.ID];
    objeto.Title = this.parseFieldString(element[Variables.columns.Title]);
    objeto.state = this.parseFieldString(element[Variables.columns.State]);

    return objeto;
  }
}
