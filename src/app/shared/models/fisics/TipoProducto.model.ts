import { ListItem } from './base/ListItem';

export class TipoProductoModel extends ListItem {

    constructor(
        public Codigo = '',
        public Condiciones = '',
        public Activo = false,
        public SolicitudHipotecarioId = 0,
        public NombreTitular = '',
        public EstadoId = 0,
    ) {
        super();
    }
}
