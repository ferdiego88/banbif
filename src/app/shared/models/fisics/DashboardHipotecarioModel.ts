export class DashboardHipotecarioModel{
    constructor(
        public Id: number,
        public Title: string,
        public CantidadSolicitudes?: number,
        public CantidadSolicitudesConcluidas?: number,
        public CantidadSolicitudesANS?: number,
        public CantidadSolicitudesANSAnterior?: number,
        public FlujoSeguimiento?: number,
        public CantidadSolicitudesAnterior?: number,
        public FlujoSeguimientoAnterior?: number,
        public Porcentaje?: number,
        public PorcentajeAnterior?: number,
        public PorcentajeReprocesos?: number,
        public PorcentajeANS?: number,
        public PorcentajeANSAnterior?: number,
        public Icono?: string,
        public Sentimiento?: string,
        public IconoAnterior?: string,
        public SentimientoAnterior?: string,
        public Variacion?: string,
        public ColorVariacion?: string,
        public IconoANS?: string,
        public SentimientoANS?: string,
        public IconoANSAnterior?: string,
        public SentimientoANSAnterior?: string,
        public VariacionANS?: string,
        public ColorVariacionANS?: string,

        public IconoReproceso?: string,
        public SentimientoReproceso?: string,
        public IconoReprocesoAnterior?: string,
        public SentimientoReprocesoAnterior?: string,
        public VariacionReproceso?: string,
        public ColorVariacionReproceso?: string,
    ) {
    }

}
