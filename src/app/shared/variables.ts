import { User } from './models/fisics/base/User';
export class Variables {

  static readonly Grupos = {
    GrupoDT: 'GrupoDT',
    GrupoEECC: 'GrupoEECC',
    GrupoSL: 'GrupoSL',
    GrupoLAB: 'GrupoLAB',
    GrupoRDM: 'GrupoRDM',
    Administradores: 'Administradores'
  };

  static readonly colores = {
    Plomo: 'c0c0c0',
    Celeste: '99ccff',
    Naranja: 'ffcc99',
    Verde: 'ccffcc',
    Crema: 'ffff99',
    Azul: '89a4d1',
    Morado: 'ccc0da',
    Blanco: 'ffffff',
    VerdeTono: '92d050',
    Flujo: {
      // Creadas: 'rgba(255,0,0,0.3)',// '#5a5ff0',
      EnProceso: '#03a9f4', // '#e2e983',
      Cerradas: '#8a8787', // '#85ed89'
    }
  };

  static readonly condicionesDesembolso = {
    ContratoFirma: `- Contra firma de minuta y bloqueo registral  inscrito en primer rango a favor de BanBif.`,
    PagoAdelantado: '- El cliente realice el pago por adelantado de las valorizaciones a realizarse para validar el uso de los fondos por cada desembolso parcial.',
    ChequeGerencia: '- Se emitirá cheque de gerencia a favor del cliente; la firma de la EEPP se realizará contra entrega del cheque de gerencia.'
  };
  static readonly constantes = {
    AnnioInicial: 2020,
    IdEtapaFinal: 14,
    IdSiRequiereEspecificacionTecnica: 5771,
    PlazoDiasVencimientoSolicitud: 2,
    Flag_PlanAhorro1: '1',
    Flag_PlanAhorro0: '0',
    PrecioVenta1: 60000,
    PrecioVenta2: 85700,
    PrecioVenta3: 85701,
    PrecioVenta4: 128300,
    PrecioVenta5: 128301,
    PrecioVenta6: 213800,
    PrecioVenta7: 213801,
    PrecioVenta8: 316800,
    PrecioVenta9: 316801,
    PrecioVenta10: 427600,
    BonoBuenPagador1: 24000,
    BonoBuenPagador2: 20000,
    BonoBuenPagador3: 18300,
    BonoBuenPagador4: 6800,
    BonoBuenPagador5: 0,
    BonoBuenPagador6: 3200,
    BonoAdicionalViviendaSostenible: 5000,
    Lista: 'Lista',
    Biblioteca: 'Biblioteca',
    TipoRenta1eraCategoria: 1,
    TipoRenta2daCategoria: 2,
    TipoRenta3eraCategoria: 3,
    TipoRenta4taCategoria: 4,
    TipoRenta5taCategoria: 5,
    SimboloSoles: 'S/',
    SimboloDolares: 'USD',
    TipoBonoViviendaAdicionalSostenibleId: 1,
    TipoMonedaSolesDatosOperacionId: 1,
    TipoMonedaDolaresDatosOperacionId: 2,
    TipoMonedaSolesPrecioVentaId: 1,
    TipoMonedaDolaresPrecioVentaId: 2,
    TipoMonedaSolesDatosAporteEfectivoId: 1,
    TipoMonedaSolesMonteAporteAFPId: 1,
    TipoProductoMiViviendaId: 1,
    TipoProductoCompraDeudaId: 3,
    TipoProductoAmpliacionRemodelacionConstruccionId: 4,
    TipoProductoHipotecarioId: 5,
    EstadoCreaExpedienteId: 1,
    EstadoRegistroCPM: 2,
    EstadoObservadoCPM: 3,
    EstadoAsignacionRiesgos: 30,
    EstadoEvaluacionRiesgos: 4,
    EstadoObservadoRiesgos: 5,
    EstadoRechazado: 6,
    EstadoDesestimado: 8,
    EstadoVerificacionRiesgos: 32,
    EstadoRegularizacionCPM: 35,
    EstadoAprobadoSinVerificacion: 33,
    EstadoAprobadoConVerificacion: 34,
    EstadoGestionFiles2: 38,
    EstadoValidacionFiles2: 39,
    EstadoDesestimiento: 40,
    EstadoObservadoGestor: 41,
    EstadoPreTerminado: 42,
    EstadoIngresoFile: 43,
    ZonaIDFFVV: 8,
  };

  static readonly path = {
    home: 'home',
    inicio: 'inicio',
    bandejaSolicitudMaterial: 'material-bandeja-solicitud',
    formCreditoDetalle: 'hipotecario/solicitud/:id',
    formCredito: 'hipotecario/solicitud',
    formTable: 'formTable',
    bandejaMisSolicitudesPendientes: 'bandejas/missolicitudespendientes',
    bandejaSolicitudes: 'bandejas/solicitudes',
    bandejaSolicitudesFinalizadas: 'bandejas/solicitudesfinalizadas',
    bandejaSolicitudesPendientes: 'bandejas/solicitudespendientes',
    bandejaSolicitudesEvaluacion: 'bandejas/solicitudesenevaluacion',
    bandejaSeguimientoSolicitudes: 'bandejas/seguimientosolicitudes',
    dashboardSolicitudesCreditoHipotecario: 'dashboard/solicitudesCredito',
    dashboardHipotecario: 'dashboard/Hipotecario'
  };

  static readonly lists = {
    Approvers: 'Approvers',
    Categories: 'Categories',
    IdGroups: 'IdGroups',
    Log: 'Log',
    Roles: 'Roles',
    SentEmails: 'SentEmails',
    AssignmentEvaluatorPermissions: 'AssignmentEvaluatorPermissions',
    MaestroDesplegables: 'MaestroDesplegables',
    MaestroParametros: 'MaestroParametros',
    MaestroMaterial: 'MaestroMaterial',
    MaestroCampos: 'MaestroCampos',
    MaestroFLujoEtapa: 'MaestroFLujoEtapa',
    MaestroLinea: 'MaestroLinea',
    MaestroProveedores: 'MaestroProveedores',
    MaestroMaterialFlujoLog: 'MaestroMaterialFlujoLog',
    MaestroMaterialDocs: 'MaestroMaterialDocs',
    MasterObjetosPermiso: 'MasterObjetosPermiso'
  };

  static readonly listas = {
    Solicitudes: 'Solicitud_Hipotecario',
    FlujoSeguimientoEtapa: 'FlujoSeguimientoEtapa',
    AdmBBPAdicional: 'BBP_Adicional',
    AdmEstado: 'Estado',
    AdmEstadoGestor: 'Estado_Gestor',
    AdmEjecutivos: 'Integrantes de la hipotecario',
    AdmLugarVisita: 'Lugar_Visita',
    AdmModalidad: 'Modalidad',
    AdmModalidadPago: 'Modalidad_Pago',
    AdmMoneda: 'Moneda',
    AdmNumeroVivienda: 'Numero_Vivienda',
    AdmOficina: 'Oficina',
    AdmObservacionesCPM: 'Observaciones_CPM',
    AdmProyectos: 'Proyectos',
    AdmTipoProductoId: 'ProductoId',
    AdmTipoSubProducto: 'Sub_Producto',
    AdmSustentoIngresos: 'Sustento_Ingresos',
    AdmSituacionPlanAhorro: 'Situacion_Plan_Ahorro',
    AdmSolicitudCreditoHipotecario: 'Solicitud_Hipotecario',
    AdmModalidadProductoId: 'Tipo_ProductoId',
    AdmTipoMonedaPrecioVenta: 'Tipo_Moneda_PrecioVenta',
    AdmTEAAutorizada: 'TEA_Autorizada',
    AdmTipoAbono: 'Tipo_Abono',
    AdmTipoMonedaAhorro: 'Tipo_Moneda_Ahorro',
    AdmTipoMonedaAporteEfectivo: 'T_Mon_Aporte_Efectivo',
    AdmTipoMonedaAporteAFP: 'T_Mon_Ret_AFP',
    AdmTipoProducto: 'Tipo_Producto',
    AdmTipoDocumento: 'Tipo_Documento',
    AdmTipoGarantia: 'Tipo_Garantia',
    AdmUltimoAbonoValidado: 'Ulitmo_Abono_Validado',
    AdmZona: 'Zona',
    AdmZonaId: 'ZonaId',
    AdmMotivoObservacionEvaluacionRiesgo: 'MotivoObservacionEvaluacionRiesgo'
  };

  static columnasHipo = {
    Tipo_ProductoId: 'Tipo_ProductoId',
    Sub_ProductoId: 'Sub_ProductoId',
    ZonaId: 'ZonaId',
    ModalidadId: 'ModalidadId',
    OficinaId: 'OficinaId',
    EstadoId: 'EstadoId',
    Tipo_DocumentoId: 'Tipo_DocumentoId',
    N_Documento: 'N_Documento',
    Nombre_Titular: 'Nombre_Titular',
    Riesgo_Maximo: 'Riesgo_Maximo',
    Sustento_IngresosId: 'Sustento_IngresosId',
    Oferta: 'Oferta',
    ProyectoId: 'ProyectoId',
    N_ViviendaId: 'N_ViviendaId',
    MonedaId: 'MonedaId',
    Mon_Valor_ComTas_Soles: 'Mon_Valor_ComTas_Soles',
    Valor_ComTas_Soles: 'Valor_ComTas_Soles',
    Mon_VRI_Soles: 'Mon_VRI_Soles',
    VRI_Soles: 'VRI_Soles',
    Numero_Desemboslo: 'Numero_Desemboslo',
    Primer_desembolso: 'Primer_desembolso',
    Segundo_desembolso: 'Segundo_desembolso',
    Tercer_desembolso: 'Tercer_desembolso',
    Aporte_Cliente: 'Aporte_Cliente',
    TEA_AutorizadoId: 'TEA_AutorizadoId',
    Mon_PrecioVentaId: 'Mon_PrecioVentaId',
    Precio_Venta: 'Precio_Venta',
    Mon_Ap_Efectivo: 'Mon_Ap_Efectivo',
    Aporte_Efectivo: 'Aporte_Efectivo',
    Mon_Aport_AFPId: 'Mon_Aport_AFPId',
    Aporte_RetiroAFP: 'Aporte_RetiroAFP',
    Mon_Desembolso: 'Mon_Desembolso',
    Mon_Gravamen: 'Mon_Gravamen',
    Mon_BBP: 'Mon_BBP',
    BBP: 'BBP',
    Mon_PBB: 'Mon_PBB',
    PBP: 'PBP',
    BBP_AdicionalId: 'BBP_AdicionalId',
    PBP_Adiconal_Sostenible: 'PBP_Adiconal_Sostenible',
    Tipo_Moneda_AhorroId: 'Tipo_Moneda_AhorroId',
    Meses_Abono: 'Meses_Abono',
    Importe_Cuota_Ahorro: 'Importe_Cuota_Ahorro',
    Situacion_Plan_AhorroId: 'Situacion_Plan_AhorroId',
    N_Abonos_Validados: 'N_Abonos_Validados',
    Ultimo_Abono_ValidadoId: 'Ultimo_Abono_ValidadoId',
    Cta_Ahorro_BanBif: 'Cta_Ahorro_BanBif',
    Desembolso: 'Desembolso',
    Grabamen: 'Grabamen',
    Modalidad_PagoId: 'Modalidad_PagoId',
    Observacion_CPMId: 'Observacion_CPMId',
    Lugar_VisitaId: 'Lugar_VisitaId',
    Periodo_Gracia: 'Periodo_Gracia',
    Tipo_GarantiaId: 'Tipo_GarantiaId',
    Tipo_AbonoId: 'Tipo_AbonoId',
    EstadoGestorId: 'EstadoGestorId'
  };
  static columnasNumericas = {
    Riesgo_Maximo: 'Riesgo_Maximo',
    Valor_ComTas_Soles: 'Valor_ComTas_Soles',
    VRI_Soles: 'VRI_Soles',
    Primer_desembolso: 'Primer_desembolso',
    Segundo_desembolso: 'Segundo_desembolso',
    Tercer_desembolso: 'Tercer_desembolso',
    Aporte_Cliente: 'Aporte_Cliente',
    Precio_Venta: 'Precio_Venta',
    Aporte_Efectivo: 'Aporte_Efectivo',
    Aporte_RetiroAFP: 'Aporte_RetiroAFP',
    BBP: 'BBP',
    PBP: 'PBP',
    PBP_Adiconal_Sostenible: 'PBP_Adiconal_Sostenible',
    Importe_Cuota_Ahorro: 'Importe_Cuota_Ahorro',
    Desembolso: 'Desembolso',
    Grabamen: 'Grabamen',
  };
  static readonly columnasDashboard = {
    Id: 'Id',
    ID: 'ID',
    Author: 'Author',
    AuthorId: 'AuthorId',
    Agencia: 'Agencia',
    Created: 'Created',
    Editor: 'Editor',
    Modified: 'Modified',
    Title: 'Title',
    ZonaId: 'ZonaId',
    OficinaId: 'OficinaId',
    FechaEstado: 'Fecha_Estado',
    EstadoId: 'EstadoId',
    Tipo_RentaId: 'Tipo_RentaId',
    MesSolicitud: 'MesSolicitud'
  };

  static readonly columnasSolicitud = {
    Id: 'Id',
    ID: 'ID',
    Title: 'Title',
    Author: 'Author',
    Anlista_Riesgos: 'Anlista_Riesgos',
    Agencia: 'Agencia',
    Created: 'Created',
    Descripcion_Inmueble: 'Descripcion_Inmueble',
    Plan_Ahorro: 'Plan_Ahorro',
    Observaciones: 'Observaciones',
    Condicion_Desembolso: 'Condicion_Desembolso',
    Comentario_Registro: 'Comentario_Registro',
    Desembolso_Ampliacion: 'Desembolso_Ampliacion',
    Cometario_Evaluacion: 'Cometario_Evaluacion',
    Comentario_Gestor_Hip: 'Comentario_Gestor_Hip',
    ComentarioGestor: 'ComentarioGestor',
    Editor: 'Editor',
    Modified: 'Modified',
    NombreTitular: 'Nombre_Titular',
    TipoDocumento: 'Tipo_Documento',
    NumeroDocumento: 'N_Documento',
    TipoProducto: 'Tipo_Producto',
    Estado: 'Estado',
    EstadoGestor: 'EstadoGestor',
    Moneda: 'Moneda',
    PrecioVenta: 'Precio_Venta',
    ModalidadPago: 'Modalidad_Pago',
    Financiamiento: 'Financiamiento',
    Zona: 'Zona',
    Oficina: 'Oficina',
    SustentoIngreso: 'Sustento_Ingresos',
    FechaEstado: 'Fecha_Estado',
    Desembolso: 'Desembolso',
    UResponsable: 'U_Responsable',
    SolicitudHipotecario: 'SolicitudHipotecario',
    Oferta: 'Oferta',
    TipoRenta: 'Tipo_Renta'
  };

  static readonly columnasSeguimiento = {
    Id: 'Id',
    ID: 'ID',
    Title: 'Title',
    SolicitudHipotecario: 'SolicitudHipotecario',
    Author: 'Author',
    Created: 'Created',
    Estado: 'Estado',
    Responsable: 'Responsable',
    FechaAtencion: 'FechaAtencion',
    EstadoFinal: 'EstadoFinal',
    NombreTitular: 'NombreTitular',
    TipoDocumento: 'TipoDocumento',
    NumeroDocumento: 'NumeroDocumento'
  };

  static readonly columns = {
    IdCanalDistribucion: 'IdCanalDistribucion',
    IdEtapaSiguiente: 'IdEtapaSiguiente',
    EtapaHabilitado: 'EtapaHabilitado',
    CargaDocumentos: 'CargaDocumentos',
    TextoLargo: 'TextoLargo',
    RolMaterialesSolicitantes: 'RolMaterialesSolicitantes',
    Nombre: 'Nombre',
    Oculto: 'Oculto',
    Texto: 'Texto',
    OrdenCampo: 'OrdenCampo',
    DesplegableCampo: 'DesplegableCampo',
    ListaCampo: 'ListaCampo',
    Seccion: 'Seccion',
    Comentarios: 'Comentarios',
    IdEtapaSiguienteEspecificacionTe: 'IdEtapaSiguienteEspecificacionTe',
    Rechazo: 'Rechazo',
    EnBorrador: 'EnBorrador',
    Abreviatura: 'Abreviatura',
    LAB: 'LAB',
    DT: 'DT',
    RDM: 'RDM',
    Categoria: 'Categoria',
    MaestroProveedor: 'MaestroProveedor',
    EECC: 'EECC',
    Author: 'Author',
    MaestroFlujoEtapa: 'MaestroFlujoEtapa',
    MaestroFLujoEtapa: 'MaestroFLujoEtapa',
    ResponsableLaboratorio: 'ResponsableLaboratorio',
    EjecutivoComercial: 'EjecutivoComercial',
    ResponsableDT: 'ResponsableDT',
    ResponsableRDM: 'ResponsableRDM',
    Padre: 'Padre',
    Codigo: 'Codigo',
    CodigoOp: 'CodigoOp',
    GruposParticipantes: 'GruposParticipantes',
    NombreGrupo: 'NombreGrupo',
    TextoBreveMaterial: 'TextoBreveMaterial',
    Valor: 'Valor',
    ContentTypeId: 'ContentTypeId',
    Id: 'Id',
    ID: 'ID',
    Title: 'Title',
    EncodedAbsUrl: 'EncodedAbsUrl',
    Email: 'Email',
    EMail: 'EMail',
    Abbreviation: 'Abbreviation',
    AdministratorsGroup: 'AdministratorsGroup',
    Answer: 'Answer',
    ApprovalDate: 'ApprovalDate',
    Approvers: 'Approvers',
    Approver: 'Approver',
    ApproversText: 'ApproversText',
    AssignedTo: 'AssignedTo1',
    Benchmark: 'Benchmark',
    BenefitsFormula: 'BenefitsFormula',
    Body: 'Body1',
    Category: 'Category1',
    CategoryText: 'CategoryText',
    CategoryAbbreviationText: 'CategoryAbbreviationText',
    CharacteristicTemplate: 'CharacteristicTemplate',
    Creado: 'Created',
    CreadoPor: 'Author',
    Code: 'Code',
    Comments: 'Comments1',
    CompletedComment: 'CompletedComment',
    ContentType: 'ContentType',
    CostSale: 'CostSale',
    CurrencySale: 'CurrencySale',
    DaysStart: 'DaysStart',
    DaysTerm: 'DaysTerm',
    Description: 'Description',
    Determinant: 'Determinant',
    DocumentOwner: 'DocumentOwner',
    DocumentOwnersGroup: 'DocumentOwnersGroup',
    Editor: 'Editor',
    EndDate: 'EndDate1',
    EsProductoTercero: 'EsProductoTercero',
    EstadoAsignacionPermisosFolderPdf: 'EstadoAsignacionPermisosFolderPd',
    EvalSheetDetailHTML: 'EvalSheetDetailHTML',
    Evaluation: 'Evaluation',
    EvaluationScale: 'EvaluationScale',
    EvaluationSheet: 'EvaluationSheet',
    EvaluationSheetCharacteristic: 'EvaluationSheetCharacteristic',
    EvaluationStatus: 'EvaluationStatus',
    Evaluator: 'Evaluator',
    ExpectedValues: 'ExpectedValues',
    FeedbackDate: 'FeedbackDate',
    FormulaDevelopmentStartDate: 'FormulaDevelopmentStartDate',
    FormulaCost: 'FormulaCost',
    FormulaReceiptDate: 'FormulaReceiptDate',
    Goodness: 'Goodness',
    Group: 'Group1',
    GroupDocumentOwner: 'GroupDocumentOwner',
    GroupingCharacteristic: 'GroupingCharacteristic',
    Ingredients: 'Ingredients',
    LastEvaluationSheet: 'LastEvaluationSheet',
    Line: 'Line',
    MailTitle: 'MailTitle',
    MailBody: 'MailBody',
    Modified: 'Modified',
    NotificationGroup: 'NotificationGroup',
    Pagina: 'Pagina',
    ParentId: 'ParentId',
    PredecessorId: 'PredecessorId',
    ProductName: 'ProductName',
    ProductProposal: 'ProductProposal',
    ProjectCode: 'ProjectCode',
    ProjectTypes: 'ProjectTypes',
    ProjectTypeLookup: 'ProjectTypeLookup',
    ProyectoAbreviaturaCategoria: 'CategoryAbbreviationText',
    ProyectoAnioCreacion: 'TargetYear',
    Reason: 'Reason',
    ReleaseCampaignCode: 'ReleaseCampaignCode',
    ReleaseStartDate: 'ReleaseStartDate',
    ReleaseEndDate: 'ReleaseEndDate',
    ReleaseYear: 'ReleaseYear',
    RequiereAprobacionG1: 'RequiereAprobacionG1',
    ReviewDate: 'ReviewDate',
    ReasonRejection: 'ReasonRejection',
    ReasonRework: 'ReasonRework',
    ReviewUser: 'ReviewUser',
    RolType: 'RolType',
    RutaPdfEvaluacionResumen: 'RutaPdfEvaluacionResumen',
    Sale: 'Sale',
    SalePrice: 'SalePrice',
    SaleUnits: 'SaleUnits',
    ShowButtonViewEvaluation: 'ShowButtonViewEvaluation',
    Segment: 'Segment',
    SendMailGroupTypeG2: 'SendMailGroupTypeG2',
    SKU: 'SKU',
    State: 'State',
    StartDate: 'StartDate1',
    Status: 'Status',
    SubmissionCount: 'SubmissionCount',
    SubmissionNumber: 'SubmissionNumber',
    Sumision: 'Sumision',
    TargetCost: 'TargetCost',
    TargetDate: 'TargetDate',
    TargetYear: 'TargetYear',
    TipoDevolucion: 'TipoDevolucion',
    Type: 'Type',
    UseFormula: 'UseFormula',
    User: 'User1',
    UserEmails: 'UserEmails',
    UserEmailsCopy: 'UserEmailsCopy',
    VacationRegistrationStatus: 'VacationRegistrationStatus',
    ValueScale: 'ValueScale',
    Weight: 'Weight',
    FormulatorTeam: 'FormulatorTeam',
    ShowDaysAlertExpiration: 'ShowDaysAlertExpiration',
    ParedFolderId: 'ParedFolderId',
    EstadoCreacionCarpetaPared: 'EstadoCreacionCarpetaPared',
    CarpetaPadre: 'CarpetaPadre',
    GrupoEscritura: 'GrupoEscritura',
    GrupoLectura: 'GrupoLectura',
    Path: 'Path',
    Member: 'Member',
    RoleDefinitionBindings: 'RoleDefinitionBindings',
    Name: 'Name',
    FileDirRef: 'FileDirRef',
    FileLeafRef: 'FileLeafRef',
    File: 'File',
    Folder: 'Folder',
    PathSavePdfEvaluators: 'PathSavePdfEvaluators',
    EvaluationSheetCode: 'EvaluationSheetCode',
    EvaluationSheetId: 'EvaluationSheetId',
    PathFolder: 'PathFolder',
    PathId: 'PathId',
    UrlSitio: 'UrlSitio',
    ResRequest: 'ResRequest',
    UsuariosEscrituraId: 'UsuariosEscrituraId',

    TipoText: 'TipoText',
    Tipo: 'Tipo'
  };

  static readonly contentTypes = {
    Approver: '0x01002F0DE5159DB83747B7DE82292E7B5803',
    Characteristic: '0x0100361BE556D73734439D6C87AE770B6804',
    CharacteristicEvaluation: '0x0100361BE556D73734439D6C87AE770B680401',
    CharacteristicEvaluationTemplate:
      '0x0100361BE556D73734439D6C87AE770B68040101',
    CharacteristicTemplate: '0x01001EE78AC9E2281541966943E33C72FC9A',
    EvaluationScale: '0x0100C0BC5A5140F3544EB01E8B4866EAA417',
  };

  public readonly ColumnasMaestroDesplegables = {
    TipoDocumentoAdjunto: 'TipoDocumentoAdjunto',
    CanalDistribucion: 'CanalDistribucion',
    SusceptibleBonificacion: 'SusceptibleBonificacion',
    VerificacionDisponibilidad: 'VerificacionDisponibilidad',
    MostrarClientes: 'MostrarClientes',
    MostrarStocks: 'MostrarStocks',
    MarcaMostrarPalmWeb: 'MarcaMostrarPalmWeb',
    SusceptibleBonEsp: 'SusceptibleBonEsp',
    GrupoTipoPosicionGeneral: 'GrupoTipoPosicionGeneral',
    GrupoTransporte: 'GrupoTransporte',
    PaisOrigen: 'PaisOrigen',
    PaisCreacion: 'PaisCreacion',
    FormaFarmaceutica: 'FormaFarmaceutica',
    GrupoImputacionMaterial: 'GrupoImputacionMaterial',
    ReqEspecificacionTecnica: 'ReqEspecificacionTecnica',
    ClaseTerapeutica1: 'ClaseTerapeutica1',
    ClaseTerapeutica2: 'ClaseTerapeutica2',
    ClaseTerapeutica3: 'ClaseTerapeutica3',
    ClaseTerapeutica4: 'ClaseTerapeutica4',
    CaracteristicaPlanificacion: 'CaracteristicaPlanificacion',
    CategoriaMaterial: 'CategoriaMaterial',
    ClaseEtiqueta: 'ClaseEtiqueta',
    ClasificacionArticulo: 'ClasificacionArticulo',
    ClasificacionMaterial: 'ClasificacionMaterial',
    CondicionAlmacenaje: 'CondicionAlmacenaje',
    CondicionTemperatura: 'CondicionTemperatura',
    Consignado: 'Consignado',
    DIM: 'DIM',
    Flete: 'Flete',
    FormaEtiqueta: 'FormaEtiqueta',
    GrupoArticuloExterno: 'GrupoArticuloExterno',
    GrupoCompras: 'GrupoCompras',
    IGV: 'IGV',
    ISC: 'ISC',
    Incoterm: 'Incoterm',
    IndicadorABY: 'IndicadorABY',
    IndicadorImpuestoCompraQ: 'IndicadorImpuestoCompraQ',
    IndicadorImpuestoCompraSLA: 'IndicadorImpuestoCompraSLA',
    IndicadorPeriodoCaducidad: 'IndicadorPeriodoCaducidad',
    InventarioCiclico: 'InventarioCiclico',
    Jerarquia1: 'Jerarquia1',
    Jerarquia2: 'Jerarquia2',
    Jerarquia3: 'Jerarquia3',
    Jerarquia4: 'Jerarquia4',
    Jerarquia5: 'Jerarquia5',
    MarcaRecuperacionDcto: 'MarcaRecuperacionDcto',
    MarcaRxOtc: 'MarcaRxOtc',
    MaterialSuceptibleBonficacion: 'MaterialSuceptibleBonficacion',
    MonedaCompraQS: 'MonedaCompraQS',
    MonedaVenta: 'MonedaVenta',
    PESO: 'PESO',
    PreferenciaArancelaria: 'PreferenciaArancelaria',
    Refrigerado: 'Refrigerado',
    Sector: 'Sector',
    SujetoLote: 'SujetoLote',
    TipoMaterial: 'TipoMaterial',
    UMI: 'UMI',
    UsoMaterialPromocional: 'UsoMaterialPromocional'
  };

}

export class UsuarioConsultado {
  static _user: User = null;
}

export class SPParse {
  static getBool(valor: any): boolean {
    if (valor) {
      return valor;
    }

    return false;
  }

  static getString(valor: any): string {
    if (valor) {
      return valor.toString();
    }

    return '';
  }

  static getNumber(valor: any): number {
    if (valor) {
      return parseInt(valor, 10);
    }

    return 0;
  }

  static getDecimal(valor: any): number {
    if (valor) {
      return parseFloat(valor);
    }

    return 0;
  }

  static getVinculo(valor: any): string {
    if (valor) {
      return valor.Url;
    }

    return '';
  }

  static getDate(valor: any): Date {
    if (valor) {
      return new Date(valor);
    }

    return null;
  }


}
