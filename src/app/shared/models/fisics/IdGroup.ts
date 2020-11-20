import { ListItemMaster } from './base/ListItemMaster';
import { Lookup } from './base/Lookup';
import { User } from './base/User';
import { Variables } from '../../variables';
import { RestFiltros } from '../../RestFiltros';
import { Group } from './base/Group';

export class IdGroup extends ListItemMaster {
  Category: Lookup;
  Group: Group;
  GroupDocumentOwner: Group;

  constructor() {
    super();

    this.Category = new Lookup();
    this.Group = new Group();
    this.GroupDocumentOwner = new Group();
  }

  public static parseJson(element: any): IdGroup {
    const objeto = new IdGroup();
    objeto.Id = element[Variables.columns.ID];
    objeto.Category = Lookup.parseJson(element[Variables.columns.Category]);
    objeto.Group = Group.parseJson(element[Variables.columns.Group]);
    objeto.GroupDocumentOwner = Group.parseJson(
      element[Variables.columns.GroupDocumentOwner]
    );

    return objeto;
  }

  public static getColumnasSelect(): string[] {
    return [
      Variables.columns.ID,
      RestFiltros.obtenerFieldExpandCategory(Variables.columns.Category),
      RestFiltros.obtenerFieldExpandUsuario(Variables.columns.Group),
      RestFiltros.obtenerFieldExpandUsuario(
        Variables.columns.GroupDocumentOwner
      ),
    ];
  }

  public static getColumnasExpand(): string[] {
    return [
      Variables.columns.Category,
      Variables.columns.Group,
      Variables.columns.GroupDocumentOwner,
    ];
  }
}
