import { ListItem } from './base/ListItem';

export class SolicitudCreditoHipotecario extends ListItem{

  constructor(
    public Tipo_ProductoId = '',
    public Nombre_Titular = '',
    // tslint:disable-next-line: variable-name
    public Sub_ProductoId = 0,
    public ModalidadId = '',
    public ZonaId = '',
    public OficinaId = '',
    public EstadoId = '',
    // tslint:disable-next-line: variable-name
    public Tipo_DocumentoId = '',
    public N_Documento = '',
    public Riesgo_Maximo = '',
    public Sustento_IngresosId = '',
    public Oferta = '',
    public Tipo_RentaId= [],
    public Tipo_RentaConyugueId= [],
    public ProyectoId = 0,
    public N_ViviendaId = '',
    public MonedaId = '',
    public TEA = '',

    public Descripcion_Inmueble = '',
    public Fecha_Tasacion_Remodelac = '',
    public Mon_Valor_ComTas_Soles = '',
    public Valor_ComTas_Soles = '',
    public Mon_VRI_Soles = '',
    public VRI_Soles = '',
    public Numero_Desemboslo = '',
    public Primer_desembolso = '',
    public Segundo_desembolso = '',
    public Tercer_desembolso = '',
    public Aporte_Cliente = '',

    public TEA_AutorizadoId = '',
    public Mon_PrecioVentaId = '',
    public Precio_Venta = '',
    public Financiamiento = '',
    public Mon_Ap_EfectivoId = '',
    public Aporte_Efectivo = '',
    public Mon_Aport_AFPId = '',
    public Aporte_RetiroAFP = '',
    public Mon_BBP = '',
    public BBP = '',
    public Mon_PBB = '',
    public PBP = '',
    public Mon_Desembolso = '',
    public Desembolso = '',
    public Mon_Gravamen = '',
    public Grabamen = '',
    public Modalidad_PagoId = '',
    public Observaciones = '',
    public Lugar_VisitaId = '',
    public Periodo_Gracia = '',
    public Tipo_GarantiaId = '',
    public Tipo_AbonoId = '',
    public Condicion_Desembolso = '',
    public Desembolso_Ampliacion = '',
    /* Plan Ahorro */
    public Tipo_Moneda_AhorroId = '',
    public Meses_Abono = '',
    public Importe_Cuota_Ahorro = '',
    public Situacion_Plan_AhorroId = '',
    public N_Abonos_Validados = '',
    public Ultimo_Abono_ValidadoId = '',
    public Plan_Ahorro = '',
    // tslint:disable-next-line: variable-name
    public Cta_Ahorro_Banbif = 0,
    public flag_PlanAhorro = 0,
    public Observacion_CPMId = 0,
    public Comentario_Registro = '',
    public Cometario_Revisor = '',

  ){
    super();
  }

}

