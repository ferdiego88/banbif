import { Variables } from './variables';

export class RestFiltros {
  public static obtenerFieldExpandUsuario(nombreColumnaExpand: string) {
    return `${nombreColumnaExpand}/${Variables.columns.ID},${nombreColumnaExpand}/${Variables.columns.Title},${nombreColumnaExpand}/${Variables.columns.EMail}`;
  }

  public static obtenerFieldExpandLookup(nombreColumnaExpand: string) {
    return `${nombreColumnaExpand}/${Variables.columns.ID},${nombreColumnaExpand}/${Variables.columns.Title}`;
  }

  public static obtenerFieldExpandCategory(nombreColumnaExpand: string) {
    return `${nombreColumnaExpand}/${Variables.columns.ID},${nombreColumnaExpand}/${Variables.columns.Title},${nombreColumnaExpand}/${Variables.columns.Abbreviation}`;
  }
}
