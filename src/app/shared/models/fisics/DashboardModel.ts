export class DashboardModel{
    constructor(
        public Id: number,
        public Title: string,
        public Cantidad?: number,
        public TiempoPromedio?: number,
        public TiempoPromedioTotal?: number,
        public Monto?: number
    ) {
    }
    
}
