export class EstadoModel{
    constructor(
        public Id = 0,
        public Title = '',
        public Activo = false,
        public Cantidad = 0,
        public Monto = 0,
        // tslint:disable-next-line: variable-name
        public Valor_ANS = 0, 
    ) {
    }
}
