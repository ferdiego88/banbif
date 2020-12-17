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

    if (element && element.Title !== undefined && element.Title !== null) {
      objeto.Id = element[Variables.columns.ID];
      objeto.Title = element[Variables.columns.Title];
    }

    return objeto;
  }

  public static parseJsonListNombres(elements: any[]): string {
    
    let nombres = "";
    let lista: Lookup[] = [];

    if (elements) {
      lista = elements.map((element) => {
        const objeto = new Lookup();        
        if (objeto) {
          objeto.Id = element[Variables.columns.ID];
          objeto.Title = element[Variables.columns.Title];
        }

        return objeto;
      });

      for(const item of lista){
        if(nombres.length > 0 ){
          nombres += " / ";
        }
        nombres += item.Title;
      }
    }

    return nombres;
  }
}
