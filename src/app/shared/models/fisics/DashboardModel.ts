export class DashboardModel{
    constructor(
        public Id: number,
        public Title: string,
        public Cantidad?: number,
        public TiempoPromedio?: number,
        public TiempoPromedioTotal?: number,
        public FueraANS?: number,
        public Monto?: number,
        public FueraANSAcumulado?: number
    ) {
    }
    
}
