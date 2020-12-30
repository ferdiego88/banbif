export class EstadoModel{
    constructor(
        public Id = 0,
        public Title = '',
        public Activo = false,
        public Cantidad = 0,
        public Monto = 0,
        // tslint:disable-next-line: variable-name
        public Valor_ANS = 0, 
        // tslint:disable-next-line: variable-name
        public ValorANS_Acumulado = 0, 
        public ANS_Renta_1 = 0, 
        public ANS_Renta_2 = 0, 
        public ANS_Renta_3 = 0, 
        public ANS_Renta_4 = 0, 
        public ANS_Renta_5 = 0, 
    ) {
    }
}
