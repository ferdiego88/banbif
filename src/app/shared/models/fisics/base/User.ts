import { Group } from './Group';
import { Variables } from 'src/app/shared/variables';

export class User {
  Id: number;
  Key: string;
  Name: string;
  Title: string;
  Email: string;
  PictureUrl: string;
  Groups: Group[];
  NombreGrupo: string;
  constructor() {
    this.Id = 0;
    this.Key = '';
    this.Name = '';
    this.Title = '';
    this.Email = '';
    this.PictureUrl = '';
    this.Groups = [];
    this.NombreGrupo = ''
  }

  public static parseJsonList(elements: any[]): User[] {
    let lista: User[] = [];

    if (elements) {
      lista = elements.map((element) => {
        const user = new User();
        if (user) {
          user.Id = element[Variables.columns.ID];
          user.Title = element[Variables.columns.Title];
          user.Email = element[Variables.columns.EMail];
      
          
        }

        return user;
      });
    }

    return lista;
  }

  public static parseJson(element: any): User {
    const user = new User();
    if (element) {
      user.Id = element[Variables.columns.ID];
      user.Title = element[Variables.columns.Title];
      user.Email = element[Variables.columns.EMail];
    }

    return user;
  }

  public static getJsonList(usuarios: User[]): any {
    if (!usuarios) {
      return [];
    }
    return { results: usuarios.map((usuario) => usuario.Id) };
  }
}
