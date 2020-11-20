import { ListItemMaster } from './base/ListItemMaster';
import { Variables } from '../../variables';

export class MailTemplate extends ListItemMaster {
  mailBody: string;
  mailTitle: string;

  constructor() {
    super();

    this.mailBody = '';
    this.mailTitle = '';
  }

  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.Title,
      Variables.columns.MailTitle,
      Variables.columns.MailBody,
      Variables.columns.State,
    ];
  }

  public static parseJson(element: any): MailTemplate {
    const objeto = new MailTemplate();
    objeto.Title = this.parseFieldString(element[Variables.columns.Title]);
    objeto.mailTitle = this.parseFieldString(
      element[Variables.columns.MailTitle]
    );
    objeto.mailBody = this.parseFieldString(
      element[Variables.columns.MailBody]
    );
    objeto.state = this.parseFieldString(element[Variables.columns.State]);
    return objeto;
  }
}
