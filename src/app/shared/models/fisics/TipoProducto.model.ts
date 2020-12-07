import { ListItem } from './base/ListItem';

export class TipoProductoModel extends ListItem {

    constructor(
        public Codigo = '',
        public Condiciones = '',
    ) {
        super();
    }
}
