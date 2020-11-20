import { User } from './User';

export class ListItem {
  AttachmentFiles: Array<any>;
  Attachments: boolean;
  Author: User;
  Created: Date;
  Editor: User;
  Id: number;
  Modified: Date;
  Title: string;

  constructor() {
    this.AttachmentFiles = [];
    this.Attachments = false;
    this.Author = new User();
    this.Created = null;
    this.Editor = new User();
    this.Id = 0;
    this.Modified = null;
    this.Title = '';
  }

  static parseFieldString(valor: any) {
    if (valor) {
      return valor;
    }
    return '';
  }

  static parseFieldInt(valor: any) {
    if (valor && !isNaN(valor)) {
      return parseInt(valor, 10);
    }
    return 0;
  }

  static parseFieldDouble(valor: any) {
    if (valor && !isNaN(valor)) {
      return parseFloat(valor);
    }
    return 0;
  }

  static getFieldLookupId(valor: string): string {
    return valor + 'Id';
  }
}
