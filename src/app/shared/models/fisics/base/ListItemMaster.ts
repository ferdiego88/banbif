import { ListItem } from './ListItem';
import { State } from '../State';
import { Variables } from '../../../variables';

export class ListItemMaster extends ListItem {
  state: State;

  constructor() {
    super();
    this.state = State.Active;
  }

  public getJsonInactivar() {
    const datos = {};
    datos[Variables.columns.State] = State.Inactive;

    return datos;
  }
}
