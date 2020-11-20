import { ListItemMaster } from './base/ListItemMaster';
import { ListItem } from './base/ListItem';
import { Variables } from '../../variables';
import { IListItemTransaccional } from './base/IListItemTransaccional';

export class Log extends ListItem implements IListItemTransaccional {
  description: string;
  pagina: string;

  constructor() {
    super();

    this.Title = '';
    this.description = '';
    this.pagina = '';
  }

  public static setNuevoElemento(
    pagina: string,
    titulo: string,
    description: any
  ): Log {
    const objeto = new Log();
    objeto.description = description.stack
      ? description.stack
      : description.message
      ? description.message
      : JSON.stringify(description);
    objeto.pagina = pagina;
    objeto.Title = titulo;

    return objeto;
  }

  public getJsonElemento(): any {
    const datos = {};
    datos[Variables.columns.Description] = this.description;
    datos[Variables.columns.Pagina] = this.pagina;
    datos[Variables.columns.Title] = this.Title;

    return datos;
  }
}
