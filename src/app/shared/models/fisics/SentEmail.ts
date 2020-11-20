import { ListItem } from './base/ListItem';
import { Variables } from '../../variables';
import { IListItemTransaccional } from './base/IListItemTransaccional';
import { EmailFormat } from './EmailFormat';
import { MailTemplateLogic } from '../logics/MailTemplateLogic';

export class SentEmail extends ListItem implements IListItemTransaccional {
  emailFormat: EmailFormat;
  mailBody: string;
  mailTitle: string;
  userEmails: string;
  userEmailsCopy: string;

  constructor(
    emailFormat: EmailFormat,
    titulo: string,
    cuerpo: string,
    correosPara: string,
    correosCopia?: string
  ) {
    super();

    this.emailFormat = emailFormat;
    this.mailBody = cuerpo;
    this.mailTitle = titulo;
    this.userEmails = correosPara;
    this.userEmailsCopy = '';

    if (correosCopia) {
      this.userEmailsCopy = correosCopia;
    }

    this.mailBody = this.obtenerCuerpoCorreoFormateado(this.emailFormat.Body);
  }

  public getJsonElemento(): any {
    const datos = {};
    datos[Variables.columns.MailBody] = this.mailBody;
    datos[Variables.columns.MailTitle] = this.mailTitle;
    datos[Variables.columns.UserEmails] = this.userEmails;
    datos[Variables.columns.UserEmailsCopy] = this.userEmailsCopy;

    return datos;
  }

  private obtenerCuerpoCorreoFormateado(formatoCorreo: string): string {
    return formatoCorreo.replace(
      MailTemplateLogic.etiquetas.Cuerpo,
      this.mailBody
    );
  }
}
