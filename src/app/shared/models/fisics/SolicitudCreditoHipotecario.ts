import { ListItem } from './base/ListItem';

export class SolicitudCreditoHipotecario extends ListItem{

  constructor(
    public Tipo_ProductoId = 0,
    public Nombre_Titular = '',
    // tslint:disable-next-line: variable-name
    public Sub_ProductoId = 0,
    public ModalidadId = 0,
    public ZonaId = 0,
    public OficinaId = 0,
    public EstadoId = 0,
    // tslint:disable-next-line: variable-name
    public Tipo_DocumentoId = 0,
    public N_Documento = '',
    public Riesgo_Maximo = '',
    public Sustento_IngresosId = '',
    public Oferta = '',
    public Tipo_RentaId= [],
    public Tipo_RentaConyugueId= [],
    public ProyectoId = '',
    public N_ViviendaId = 0,
    public MonedaId = 0,
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

    public TEA_AutorizadoId = 0,
    public Mon_PrecioVentaId = 0,
    public Precio_Venta = 0,
    public Financiamiento = '',
    public Mon_Ap_EfectivoId = 0,
    public Aporte_Efectivo = 0,
    public Mon_Aport_AFPId = 0,
    public Aporte_RetiroAFP = 0,
    public Mon_BBP = 0,
    public BBP = 0,
    public Mon_PBB = 0,
    public PBP = 0,
    public Mon_Desembolso = 0,
    public Desembolso = 0,
    public Mon_Gravamen = 0,
    public Grabamen = 0,
    public Modalidad_PagoId = 0,
    public Observaciones = '',
    public Lugar_VisitaId = 0,
    public Periodo_Gracia = '',
    public Tipo_GarantiaId = 0,
    public Tipo_AbonoId = '',
    public Condicion_Desembolso = '',
    public Desembolso_Ampliacion = '',
    /* Plan Ahorro */
    public Tipo_Moneda_AhorroId = 0,
    public Meses_Abono = 0,
    public Importe_Cuota_Ahorro = 0,
    public Situacion_Plan_AhorroId = 0,
    public N_Abonos_Validados = '',
    public Ultimo_Abono_ValidadoId = 0,
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

