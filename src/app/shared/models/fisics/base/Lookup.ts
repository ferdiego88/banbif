import { Variables } from 'src/app/shared/variables';

export class Lookup {
  Id: number;
  Title: string;

  constructor(id?: number, title?: string) {
    this.Id = 0;
    this.Title = '';

    if (id) {
      this.Id = id;
    }
    if (title) {
      this.Title = title;
    }
  }

  public static parseJson(element: any): Lookup {
    const objeto = new Lookup();

    if (element) {
      objeto.Id = element[Variables.columns.ID];
      objeto.Title = element[Variables.columns.Title];
    }

    return objeto;
  }
}
