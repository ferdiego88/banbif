export class DashboardHipotecarioModel{
    constructor(
        public Id: number,
        public Title: string,
        public CantidadSolicitudes?: number,
        public FlujoSeguimiento?: number,
        public CantidadSolicitudesAnterior?: number,
        public FlujoSeguimientoAnterior?: number,
        public Porcentaje?: number,
        public PorcentajeAnterior?: number,
        public Icono?: string,
        public Sentimiento?: string,
        public IconoAnterior?: string,
        public SentimientoAnterior?: string,
        public Variacion?: string,
        public ColorVariacion?: string,
    ) {
    }

}
