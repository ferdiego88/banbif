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
    public Sustento_IngresosId = 0,
    public Oferta = '',
    public Tipo_RentaId= [],
    public Tipo_RentaConyugueId= [],
    public ProyectoId = 0,
    public N_ViviendaId = 0,
    public MonedaId = 0,
    public TEA = 0,
    public Descripcion_Inmueble = '',
    public Fecha_Tasacion_Remodelac = '',
    public Mon_Valor_ComTas_Soles = '',
    public Valor_ComTas_Soles = '',
    public Mon_VRI_Soles = '',
    public VRI_Soles = 0,
    public Numero_Desemboslo = 0,
    public Primer_desembolso = 0,
    public Segundo_desembolso = 0,
    public Tercer_desembolso = 0,
    public Aporte_Cliente = 0,
    public TEA_AutorizadoId = 0,
    public Mon_PrecioVentaId = 0,
    public Precio_Venta = 0,
    public Financiamiento = 0,
    public Mon_Ap_EfectivoId = 0,
    public Aporte_Efectivo = 0,
    public Mon_Aport_AFPId = 0,
    public Aporte_RetiroAFP = 0,
    public Mon_BBP = 0,
    public BBP = 0,
    public Mon_PBB = 0,
    public PBP = 0,
    public PBP_Adiconal_Sostenible=0,
    public Mon_Desembolso = '',
    public Desembolso = 0,
    public Mon_Gravamen = '',
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
    public N_Abonos_Validados = 0,
    public Ultimo_Abono_ValidadoId = 0,
    public Plan_Ahorro = '',
    public Cta_Ahorro_BanBif = 0,
    public flag_PlanAhorro = '',
    public Observacion_CPMId = 0,
    public Comentario_Registro = '',
    
    public Cometario_Revisor = '',
    public Cometario_Evaluacion = '',
    public EstadoGestorId = '',
    public Fecha_Gestor_Hip = '',
    public Comentario_Gestor_Hip = '',
    public BBP_AdicionalId = '',
    public Fecha_Estado = '',
    public Contador_ObservCPM = 0,
    public Contador_ObservRiesgos = 0,
    public ContadorObs_Gestor = 0,
    public Contador_ObservData = 0,
    public Enlace_Documentos = {
      Description: '',
      Url: ''
    },
    public Sub_Producto = {
      Id: '',
      Title: ''
    },
    public Tipo_Producto = {
      Id: '',
      Title: ''
    },
    public Oficina = {
      Id: '',
      Title: ''
    },
    public Estado = {
      Id: '',
      Title: ''
    },
    
    public Desembolsado = false,
    public NumeroPropuesta = '',
    public FechaIngresoRiesgo = null,
    public FechaObservacionRiesgo = null,     
    
    public AuthorId = 0,
    
    public EjecutivoId = 0,
    public Ejecutivo = {
      Id: '',
      Title: ''
    },

    public Anlista_RiesgosId = 0,
    public Anlista_Riesgos = {
      Id: '',
      Title: ''
    },

    public MotivoObsEvaluacionRiesgoId = '',
    public MotivoObsEvaluacionRiesgo = {
      Id: '',
      Title: ''
    },

    public UsuarioIngresoFileId = null,
    public UsuarioIngresoFile = {
      Id: '',
      Title: ''
    },
    
  ){
    super();
  }

}

