import { ListItem } from './base/ListItem';

export class SolicitudCreditoHipotecario extends ListItem{

  constructor(
    public Tipo_ProductoId = '',
    public Nombre_Titular = '',
    public Sub_ProductoId = 0,
    public ModalidadId = '',
    public ZonaId = '',
    public OficinaId = '',
    public EstadoId = '',
    public Tipo_DocumentoId = '',
    public N_Documento = '',
    public Riesgo_Maximo = '',
    public Sustento_IngresosId = '',
    public ProyectoId = '',
    public N_ViviendaId = '',
    public MonedaId = '',
    public TEA = '',
    public TEA_AutorizadoId = '',
    public Mon_PrecioVentaId = '',
    public Precio_Venta = '',
    public Financiamiento = '',
    public Mon_Ap_EfectivoId = '',
    public Aporte_Efectivo = '',
    public Mon_Aport_AFPId = '',
    public Aporte_RetiroAFP = '',
    public Mon_Desembolso = '',
    public Desembolso = '',
    public Mon_Gravamen = '',
    public Grabamen = '',
    // public Modalidad_PagoId = '',
    // public ZonaId = '',
    // public ZonaId = '',
    // public ZonaId = '',
    // public ZonaId = '',

  ){
    super();
  }

}

