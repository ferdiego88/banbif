export class DashboardHipotecarioModel{
    constructor(
        public Id: number,
        public Title: string,
        public CantidadSolicitudes?: number,
        public CantidadSolicitudesAnterior?: number,
        public NumeradorSolicitudesConcluidas?: number,
        public CantidadSolicitudesConcluidasAnterior?: number,
        public CantidadSolicitudesANS?: number,
        
        public NumeradorSolicitudesANS?: number,
        public DenominadorSolicitudesANS?: number,
        public NumeradorSolicitudesANSMesAnterior?: number,
        public DenominadorSolicitudesANSMesAnterior?: number,

        public CantidadSolicitudesANSAnterior?: number,
        public DenominadorSolicitudesConcluidas?: number,
        public FlujoSeguimientoAnterior?: number,
        public FlujoSeguimientoReprocesos?: number,
        public FlujoSeguimientoReprocesosAnterior?: number,
        public Porcentaje?: number,
        public PorcentajeAnterior?: number,
        public PorcentajeReprocesos?: number,
        public PorcentajeReprocesosAnterior?: number,
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
