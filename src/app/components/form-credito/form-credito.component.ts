import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit, ApplicationRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralListService } from '../../shared/services/general-list.service';
import { MasterService } from '../../shared/services/master.service';
import { TipoProductoModel, TipoSubProductoModel, ZonaModel, SolicitudCreditoHipotecario } from '../../shared/models/fisics';
import { Variables } from 'src/app/shared/variables';
import { formatCurrency, getCurrencySymbol, CurrencyPipe } from '@angular/common';
import '../../../assets/js/maskMoney/moneyFormat.js';
// import {default as _rollupMoment} from 'moment';
import * as _moment from 'moment';
const moment = _moment;
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormularioBase } from '../../shared/pages/formularioBase';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerVisibilityService } from 'ng-http-loader';
import Swal from 'sweetalert2';
import { User } from 'src/app/shared/models/fisics/base/User';
import { Lookup } from 'src/app/shared/models/fisics/base/Lookup';
import { debug } from 'console';
import { Funciones } from 'src/app/shared/funciones';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY'
  }
};
declare var myExtObject: any;

@Component({
  selector: 'app-form-credito',
  templateUrl: './form-credito.component.html',
  styleUrls: ['./form-credito.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CurrencyPipe
  ],

})
export class FormCreditoComponent extends FormularioBase implements OnInit {
  date = new FormControl(moment());
  ItemSolicitud: SolicitudCreditoHipotecario;
  tipoProductoList: TipoProductoModel[];
  modalidadList: TipoProductoModel[];
  oficinaList: TipoProductoModel[];
  typeDocumentList: TipoProductoModel[];
  sustIngresosList: TipoProductoModel[];
  projectList: TipoProductoModel[];
  nviviendaList: TipoProductoModel[];
  currencyList: TipoProductoModel[];
  currencyAporteEfectivoList: TipoProductoModel[];
  currencyAporteAFPList: TipoProductoModel[];
  BBPAdicionalList: TipoProductoModel[];
  TEAList: TipoProductoModel[];
  typeCurrencyList: TipoProductoModel[];
  paymentMethodList: TipoProductoModel[];
  visitingPlaceList: TipoProductoModel[];
  estadoGestorList: TipoProductoModel[];
  typeguarenteeList: TipoProductoModel[];
  garantiasList: TipoProductoModel[];
  paymentTypeList: TipoProductoModel[];
  tipoSubProductoList: TipoSubProductoModel[];
  estadoList: TipoProductoModel[];
  estadoLegalList: TipoProductoModel[];
  estadoMiViviendaList: TipoProductoModel[];
  observacionesCPMList: TipoProductoModel[];
  zonaModelList: ZonaModel;
  motivoObservacionEvaluacionRiesgoList: Lookup[];

  typeCurrencySaving: TipoProductoModel[];
  planSituationSavingList: TipoProductoModel[];
  LastValidatedBonoList: TipoProductoModel[];

  PertenceGrupo_U_Oficina: boolean = false;
  PertenceGrupo_U_ReemplazoOficina: boolean = false;
  PertenceGrupo_U_CPM: boolean = false;
  PertenceGrupo_U_Asignacion_Riesgos: boolean = false;
  PertenceGrupo_U_Evaluacion: boolean = false;
  PertenceGrupo_U_Reasignador_Riesgos: boolean = false;
  PertenceGrupo_U_Verificacion_Riesgos: boolean = false;
  PertenceGrupo_U_Asistente_Gestor: boolean = false;
  PertenceGrupo_U_Gestor: boolean = false;
  PertenceGrupo_U_Garantias: boolean = false;
  PertenceGrupo_U_ValidadorGarantias: boolean = false;
  PertenceGrupo_U_Legal: boolean = false;
  PertenceGrupo_U_MiVivienda: boolean = false;
  PertenceGrupo_U_Desembolso: boolean = false;

  mostrarBotones_IngresoFiles: boolean = false;
  mostrarBotones_RegistroGarantia: boolean = false;
  mostrarBotones_ObservadoGarantia: boolean = false;
  mostrarBotones_ValidacionGarantia: boolean = false;
  mostrarBotones_GestionLegal: boolean = false;
  mostrarBotones_ObservadoLegal: boolean = false;
  mostrarBotones_ValidacionGestor: boolean = false;
  mostrarBotones_ObservadoGestorLegal: boolean = false;
  mostrarBotones_ObservadoGestorDesembolso: boolean = false;
  mostrarBotones_MiVivienda: boolean = false;
  mostrarBotones_ObservadoMiVivienda: boolean = false;
  mostrarBotones_EsperaFondos: boolean = false;
  mostrarBotones_ValidacionDesembolso: boolean = false;
  mostrarBotones_ObservadoDesembolso: boolean = false;
  mostrarBotones_EjecucionDesembolso: boolean = false;

  mostrarCamposObligatorios: boolean = false;

  mostrarCampo_ComentarioGarantia: boolean = false;
  mostrarCampo_ComentarioOficinaFile2: boolean = false;
  mostrarCampo_ComentarioValidadorGarantia: boolean = false;
  mostrarCampo_ComentarioLegal: boolean = false;
  mostrarCampo_ComentarioMiVivienda: boolean = false;
  mostrarCampo_ComentarioDesembolso: boolean = false;

  mostrarEjecutivo = false;
  mostrarEstado = false;
  IdUsuarioActual = 0;

  showSaving = false;
  showGarantias = false;
  showBotonesProducto = true;
  showPVenta = true;
  showmessageVivienda = false;
  showCuotaInicial = false;
  showBuenPagador = false;
  showBuenAplicacion = false;
  showTipoGarantiaAbono = true;
  showPlanAhorro = false;
  flagPlanAhorro = Variables.constantes.Flag_PlanAhorro0;

  showObservacionCPM = false;
  showComentarioCPM = false;
  showComentarioRiesgos = false;
  showMotivoObservacionRiesgos = false;
  showAnalistaRiesgos = false;
  showControlesGestor = false;
  showComentarioRevisor = false;

  mostrarNumeroPropuesta = false;

  showBtnObservacionCPM = false;
  showBtnAprobar = false;
  showBtnAprobarSinVerificacion = false;
  showBtnAprobarEnVerificacion = false;
  showBtnObservacionOficina = false;
  showBtnRechazar = false;
  showBtnObservarRegistro = false;
  showComentarioGestor = false;
  showDesembolsado: boolean = false;

  showBtnGuardarBorrador = true;
  showBtnCancelar = true;
  showBtnEnviar = true;
  showBtnEnviarRegularizar = true;
  showBtnGrabar = false;
  showBtnObservar = true;
  showAsignacionRiesgos = true;

  esMiVivienda = false;

  mostrarBotonEnviarGestionFiles2 = false;
  mostrarBotonEnviarValidacionFiles2 = false;
  mostrarBotonEnviarObservadoGestor = false;
  mostrarBotonDesestimiento = false;
  mostrarBotonGuardarPreTerminado = false;
  mostrarBotonEnviarRegistroCPM = false;
  mostrarBotonEnviarIngresoFiles2 = false;

  rentaTitular = [];
  rentaConyugue = [];
  textoCondicionDesembolso: string[] = [];
  condicionDesembolso = '';
  descripcionInmbueble = '';
  observacionesOpcional = '';
  cantidad = '';
  desembolsoAmpliacion = '';
  planAhorro = '';
  comentarioRegistro = '';
  comentarioRevisor = '';
  comentarioEvaluacion = '';
  comentarioGestorHipotecario = '';
  events: string[] = [];
  descripcionDocumentos = '';
  enlaceDocumentos = '';
  valueCondicionDesembolso = '';
  expRegular = /(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig;
  colorBoton = 'rgba(2, 139, 255, 1)';
  colorletraBoton = 'white';

  creditForm = this.fb.group({
    Tipo_ProductoId: [null, Validators.required],
    ejecutivo: [null],
    Analista_Riesgos: [null],
    Sub_ProductoId: [null, Validators.required],
    ZonaId: [null, Validators.required],
    ModalidadId: [null, Validators.required],
    OficinaId: [null, Validators.required],
    EstadoId: [0],
    EstadoLegalId: [0],
    EstadoMiViviendaId: [0],
    Tipo_DocumentoId: [null, Validators.required],
    N_Documento: [null, [Validators.required, Validators.maxLength(11)]],
    Nombre_Titular: [null, Validators.required],
    Riesgo_Maximo: [null],
    Sustento_IngresosId: [null],
    Oferta: [null],
    T1: [null],
    T2: [null],
    T3: [null],
    T4: [null],
    T5: [null],
    C1: [null],
    C2: [null],
    C3: [null],
    C4: [null],
    C5: [null],
    ProyectoId: [null],
    N_ViviendaId: [null],
    tipoMoneda: [null],
    MonedaId: [null],
    TEA: [null],
    TEA_AutorizadoId: [null],
    Mon_PrecioVentaId: [null],
    Precio_Venta: [null],
    pFinanciamiento: [null],
    Mon_Desembolso: [null],
    Desembolso: [null],
    Mon_Gravamen: [null],
    Mon_BBP: [null],
    Mon_PBB: [null],
    BBP: [null],
    PBP: [null],
    Grabamen: [null],
    Modalidad_PagoId: [null],
    Lugar_VisitaId: [null],
    Periodo_Gracia: [null],
    Tipo_GarantiaId: [null],
    Tipo_AbonoId: [null],
    /* Plan Ahorro*/
    Meses_Abono: [null],
    Tipo_Moneda_AhorroId: [null],
    Importe_Cuota_Ahorro: [null],
    Situacion_Plan_AhorroId: [null],
    N_Abonos_Validados: [null],
    Ultimo_Abono_ValidadoId: [null],
    Cta_Ahorro_BanBif: [null],
    Plan_Ahorro: [null],
    /*Fin Plan Ahorro */

    /* Cuota Inicial*/
    Mon_Ap_Efectivo: [null],
    Aporte_Efectivo: [null],
    Mon_Aport_AFPId: [null],
    Aporte_RetiroAFP: [null],
    BBP_AdicionalId: [null],
    PBP_Adiconal_Sostenible: [null],
    /* Fin Cuota Inicial*/

    /* Ini Garantias*/
    Descripcion_Inmueble: [null],
    Fecha_Tasacion_Remodelac: [new Date()],
    Mon_Valor_ComTas_Soles: [null],
    Valor_ComTas_Soles: [null],
    Mon_VRI_Soles: [null],
    VRI_Soles: [null],
    /* Fin Garantias*/

    Numero_Desemboslo: [null],
    Primer_desembolso: [null],
    Segundo_desembolso: [null],
    Tercer_desembolso: [null],
    Aporte_Cliente: [null],
    Observaciones: [null],
    Observacion_CPMId: [null,],
    Observacion_CPM: [null,],
    Comentario_Registro: [null],
    Cometario_Revisor: [null],
    Cometario_Revisor1: [null],
    Cometario_Evaluacion: [null],
    Condicion_Desembolso: [null],
    Condicion_Desembolso1: [null],
    Desembolso_Ampliacion: [null],
    Enlace_Documentos: [null],
    Anlista_RiesgosId: [null],
    EstadoGestorId: [null],
    Fecha_Gestor_Hip: [new Date()],
    Comentario_Gestor_Hip: [null],

    ComentarioGestor: [null],
    Desembolsado: [null],
    NumeroPropuesta: [null],
    FechaIngresoRiesgo: [null],
    MotivoObsEvaluacionRiesgoId: [null],
    UsuarioIngresoFile: [null],
    UsuarioIngresoFileId: [null],
    ComentarioGarantia: [null],
    ComentarioOficinaFile2: [null],
    ComentarioValidadorGarantia: [null],
    ComentarioLegal: [null],
    ComentarioMiVivienda: [null],
    ComentarioDesembolso: [null],

    /*postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],*/
    //shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;

  comentarios = [
    Variables.columnasSolicitud.Descripcion_Inmueble,
    Variables.columnasSolicitud.Plan_Ahorro,
    Variables.columnasSolicitud.Observaciones,
    Variables.columnasSolicitud.Condicion_Desembolso,
    Variables.columnasSolicitud.Comentario_Registro,
    Variables.columnasSolicitud.Desembolso_Ampliacion,
    Variables.columnasSolicitud.Cometario_Evaluacion,
    Variables.columnasSolicitud.Comentario_Gestor_Hip,
    Variables.columnasSolicitud.ComentarioGestor,
    Variables.columnasSolicitud.ComentarioGarantia,
    Variables.columnasSolicitud.ComentarioOficinaFile2,
    Variables.columnasSolicitud.ComentarioValidadorGarantia,
    Variables.columnasSolicitud.ComentarioLegal,
    Variables.columnasSolicitud.ComentarioMiVivienda,
    Variables.columnasSolicitud.ComentarioDesembolso
  ];

  Desembolso = 0;

  constructor(
    private fb: FormBuilder,
    private generalListService: GeneralListService,
    public masterService: MasterService,
    public route: ActivatedRoute,
    public router: Router,
    private solicitudService: SolicitudesService,
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public zone: NgZone,
    public spinner: SpinnerVisibilityService,
    private currencyPipe: CurrencyPipe
  ) {
    super('Solicitud de Crédito Hipotecario', applicationRef, dialog, route, router, masterService, zone, spinner);

  }

  ngOnInit() {
    this.mostrarEjecutivo = false;
    this.mostrarEstado = false;
    this.showBtnObservar = false;

    this.generalListService.getCurrentUser().then(resultUsuario => {

      this.IdUsuarioActual = resultUsuario.Id;
      this.PertenceGrupo_U_Oficina = resultUsuario.Groups.filter(x => x.Title === "U_Oficina").length > 0;
      this.PertenceGrupo_U_ReemplazoOficina = resultUsuario.Groups.filter(x => x.Title === "U_ReemplazoOficina").length > 0;
      this.PertenceGrupo_U_CPM = resultUsuario.Groups.filter(x => x.Title === "U_CPM").length > 0;
      this.PertenceGrupo_U_Asignacion_Riesgos = resultUsuario.Groups.filter(x => x.Title === "U_Asignacion_Riesgos").length > 0;
      this.PertenceGrupo_U_Evaluacion = resultUsuario.Groups.filter(x => x.Title === "U_Evaluacion").length > 0;
      this.PertenceGrupo_U_Reasignador_Riesgos = resultUsuario.Groups.filter(x => x.Title === "U_Reasignador_Riesgos").length > 0;
      this.PertenceGrupo_U_Verificacion_Riesgos = resultUsuario.Groups.filter(x => x.Title === "U_Verificacion_Riesgos").length > 0;
      this.PertenceGrupo_U_Asistente_Gestor = resultUsuario.Groups.filter(x => x.Title === "U_Asistente_Gestor").length > 0;
      this.PertenceGrupo_U_Gestor = resultUsuario.Groups.filter(x => x.Title === "U_Gestor").length > 0;
      this.PertenceGrupo_U_Garantias = resultUsuario.Groups.filter(x => x.Title === "U_Garantias").length > 0;
      this.PertenceGrupo_U_ValidadorGarantias = resultUsuario.Groups.filter(x => x.Title === "U_ValidadorGarantias").length > 0;
      this.PertenceGrupo_U_Legal = resultUsuario.Groups.filter(x => x.Title === "U_Legal").length > 0;
      this.PertenceGrupo_U_MiVivienda = resultUsuario.Groups.filter(x => x.Title === "U_MiVivienda").length > 0;
      this.PertenceGrupo_U_Desembolso = resultUsuario.Groups.filter(x => x.Title === "U_Desembolso").length > 0;

      let tieneAccesso = true;

      this.route.params.subscribe(param => {
        if (param.id === undefined && !this.PertenceGrupo_U_Oficina) {
          tieneAccesso = false;
          this.mostrarModalInformativo("Mensaje de Validación", 'Su usuario no pertenece al grupo "U_Oficina".');
          this.router.navigate(['/bandejas/consultas']);
        }
      });

      if (tieneAccesso) {
        this.getTypeProducts();
        this.valueSubProducto();
        this.valueModalidad();
        this.getZonas();
        this.valueOficina();
        this.getTypeDocument();
        this.getSustentoIngresos();
        this.getProject();
        this.getNVivienda();
        this.getCurrency();
        this.getCurrencyAporteEfectivo();
        this.getCurrencyAporteAFP();
        this.getTEA();
        this.getTypeCurrencyPriceSale();
        this.getPaymentMethod();
        this.getVisitingPlace();
        this.getvalueGarantias();
        this.getPaymentType();
        this.getTypeCurrencySaving();
        this.getPlanSituationSaving();
        this.getLastValidatedBono();
        this.getEstado();
        this.getEstadoLegal();
        this.getEstadoMiVivienda();
        this.getBBPAdicional();
        this.getObservacionesCPM();
        this.getEstadoGestor();
        this.getMotivoObservacionEvaluacionRiesgo();

        this.route.params.subscribe(
          param => {
            if (param.id) {
              this.obtenerItemSolicitud();
              this.creditForm.get('EstadoId').disable();
              this.creditForm.get('EstadoLegalId').disable();
              this.creditForm.get('EstadoMiViviendaId').disable();
              this.creditForm.controls.Plan_Ahorro.disable();
            }
            else {
              this.creditForm.get('EstadoId').disable();
              this.creditForm.get('EstadoLegalId').disable();
              this.creditForm.get('EstadoMiViviendaId').disable();
              this.creditForm.controls.Plan_Ahorro.disable();
              this.listenerTipoMoneda();
              this.listenerTipoGarantia();
              this.listenerBonoBuenPagador();
              this.listenerPBPAdicionalSostenible();
            }
          })
      }

    }).catch(error => console.error(error));
  }

  setformatoMoneda() {
    // Use the pipe to display currency
    this.creditForm.valueChanges.subscribe(form => {
      if (form.Riesgo_Maximo) {
        this.creditForm.patchValue({
          Riesgo_Maximo: this.currencyPipe.transform(form.Riesgo_Maximo.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
        }, { emitEvent: false });
      }
    });
  }

  obtenerItemSolicitud() {
    this.route.params.subscribe(
      param => {
        if (param.id) {
          this.showLoading();
          this.solicitudService.getItemById(param.id)
            .then(ItemsSolicitud => {

              this.mostrarEjecutivo = true;
              this.mostrarEstado = true;

              this.ItemSolicitud = ItemsSolicitud[0];
              console.log(this.ItemSolicitud);

              if (!Funciones.esNullOrUndefined(this.ItemSolicitud.AuthorId) && this.ItemSolicitud.AuthorId > 0) {
                const Author = {
                  Id: this.ItemSolicitud.Author.Id,
                  Title: this.ItemSolicitud.Author.Title
                };

                this.creditForm.controls.ejecutivo.setValue([Author]);
              }

              if (!Funciones.esNullOrUndefined(this.ItemSolicitud.Anlista_RiesgosId) && this.ItemSolicitud.Anlista_RiesgosId > 0) {
                const analista = {
                  Id: this.ItemSolicitud.Anlista_Riesgos.Id,
                  Title: this.ItemSolicitud.Anlista_Riesgos.Title
                };
                this.creditForm.controls.Analista_Riesgos.setValue([analista]);
              }

              for (const i of this.comentarios) {
                const controlForm = this.ItemSolicitud[i];
                if (controlForm !== null) {
                  const cadControlForm = controlForm.replace(this.expRegular, '');
                  this.creditForm.controls[i].setValue(cadControlForm);
                }
              }

              for (const key in Variables.columnasHipo) {
                if (Object.prototype.hasOwnProperty.call(Variables.columnasHipo, key)) {
                  const element = Variables.columnasHipo[key];
                  this.creditForm.controls[element].setValue(this.ItemSolicitud[element]);
                }
              }

              //debugger;

              this.creditForm.controls.EstadoLegalId.setValue(this.ItemSolicitud["EstadoLegalId"]);
              this.creditForm.controls.EstadoMiViviendaId.setValue(this.ItemSolicitud["EstadoMiViviendaId"]);

              this.creditForm.controls.TEA.setValue(this.ItemSolicitud.TEA);

              this.creditForm.controls.pFinanciamiento.setValue(this.ItemSolicitud.Financiamiento * 100);

              this.rentaTitular = this.ItemSolicitud.Tipo_RentaId;

              if (this.rentaTitular != null) {
                for (const numero of this.rentaTitular) {
                  this.creditForm.get(`T${numero}`).setValue(true);
                }
              }

              this.rentaConyugue = this.ItemSolicitud.Tipo_RentaConyugueId;

              if (this.rentaConyugue.length != null) {
                for (const numero of this.rentaConyugue) {
                  this.creditForm.get(`C${numero}`).setValue(true);
                }
              }

              const Fecha_Tasacion_Remodelac = this.ItemSolicitud.Fecha_Tasacion_Remodelac;

              const Fecha_Gestor_Hip = this.ItemSolicitud.Fecha_Gestor_Hip;

              this.creditForm.controls.Fecha_Tasacion_Remodelac.setValue(new Date(Fecha_Tasacion_Remodelac));

              if (Fecha_Gestor_Hip) {
                this.creditForm.controls.Fecha_Gestor_Hip.setValue(new Date(Fecha_Gestor_Hip));
              } else {
                this.creditForm.controls.Fecha_Gestor_Hip.setValue(new Date());
              }

              if (this.ItemSolicitud.flag_PlanAhorro === Variables.constantes.Flag_PlanAhorro1
                && this.ItemSolicitud.EstadoId !== Variables.constantes.EstadoAsignacionRiesgos) {
                this.showPlanAhorro = true;
              } else {
                this.showPlanAhorro = false;
              }

              this.comentarioRevisor = this.ItemSolicitud.Cometario_Revisor;

              if (this.comentarioRevisor !== null) {
                const cadComentarioRevisor = this.comentarioRevisor.replace(this.expRegular, '');
                this.creditForm.controls.Cometario_Revisor.setValue(cadComentarioRevisor);
                this.creditForm.controls.Cometario_Revisor1.setValue(cadComentarioRevisor);
              }

              if (!Funciones.esNullOrUndefined(this.ItemSolicitud.MotivoObsEvaluacionRiesgoId !== null)) {
                const MotivoObsEvaluacionRiesgo = this.ItemSolicitud.MotivoObsEvaluacionRiesgoId;
                this.creditForm.controls.MotivoObsEvaluacionRiesgoId.setValue(MotivoObsEvaluacionRiesgo);
              }

              if (this.ItemSolicitud.Desembolsado === null) {
                this.creditForm.controls.Desembolsado.setValue(false);
              } else {
                this.creditForm.controls.Desembolsado.setValue(this.ItemSolicitud.Desembolsado);
              }

              if (this.ItemSolicitud.FechaIngresoRiesgo === null) {
                this.creditForm.controls.FechaIngresoRiesgo.setValue(null);
              } else {
                const fechaIngresoRiesgo = new Date(this.ItemSolicitud.FechaIngresoRiesgo);
                this.creditForm.controls.FechaIngresoRiesgo.setValue(fechaIngresoRiesgo);
              }

              if (this.ItemSolicitud.NumeroPropuesta === null) {
                this.creditForm.controls.NumeroPropuesta.setValue('');
              } else {
                this.creditForm.controls.NumeroPropuesta.setValue(this.ItemSolicitud.NumeroPropuesta);
              }

              if (this.ItemSolicitud.FechaObservacionRiesgo !== null) {
                this.ItemSolicitud.FechaObservacionRiesgo = new Date(this.ItemSolicitud.FechaObservacionRiesgo);
              }

              if (!Funciones.esNullOrUndefined(this.ItemSolicitud.UsuarioIngresoFileId)) {
                const usuarioIngresoFile = {
                  Id: this.ItemSolicitud.UsuarioIngresoFile.Id,
                  Title: this.ItemSolicitud.UsuarioIngresoFile.Title
                };
                this.creditForm.controls.UsuarioIngresoFile.setValue([usuarioIngresoFile]);
              }

              for (const key in Variables.columnasNumericas) {
                if (Object.prototype.hasOwnProperty.call(Variables.columnasNumericas, key)) {
                  const element = Variables.columnasNumericas[key];
                  this.creditForm.controls[element].setValue
                    (myExtObject.MASKMONEY(this.ItemSolicitud[element], '-###,###,###,##0.00', 1));
                }
              }
              this.ItemSolicitud.Enlace_Documentos && this.ItemSolicitud.Enlace_Documentos !== null && (this.descripcionDocumentos = this.ItemSolicitud.Enlace_Documentos.Description);

              if (this.ItemSolicitud.Enlace_Documentos === null) {
                this.mostrarModalInformativo("Mensaje de Validación", 'Vuelva a ingresar en unos minutos, se está creando la carpetas de la solicitud.');
                this.router.navigate(['/bandejas/consultas']);
              } else {
                this.enlaceDocumentos = this.ItemSolicitud.Enlace_Documentos.Url;
              }

              this.listenerTipoMoneda();
              this.listenerTipoGarantia();
              this.setMonedaGarantia();
              this.listenerBonoBuenPagador();
              this.listenerBotones();
              this.setDisabledControlsBuenPagador();
              this.listenerPBPAdicionalSostenible();

              this.hideLoading();
            })
            .catch(error => { this.hideLoading(); this.showErrorMessage('Los datos no se Obtuvieron Correctamente, Recargue la página'); });
        } else {
          this.hideLoading();
        }
      }
    );
  }

  getTypeProducts() {
    this.generalListService.get(Variables.listas.AdmTipoProducto, 'Title')
      .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
      .catch(error => console.error(error));
  }

  setearMonedasSoles() {
    this.creditForm.get('MonedaId').setValue(Variables.constantes.TipoMonedaSolesDatosOperacionId);
    this.creditForm.get('Mon_Desembolso').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_Gravamen').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_PrecioVentaId').setValue(Variables.constantes.TipoMonedaSolesPrecioVentaId);
    this.creditForm.get('Mon_Ap_Efectivo').setValue(Variables.constantes.TipoMonedaSolesDatosAporteEfectivoId);
    this.creditForm.get('Mon_Aport_AFPId').setValue(Variables.constantes.TipoMonedaSolesMonteAporteAFPId);
    this.creditForm.get('Mon_BBP').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_PBB').setValue(Variables.constantes.SimboloSoles);
  }

  setearMonedasEmpty() {
    this.creditForm.get('MonedaId').setValue(null);
    this.creditForm.get('Mon_Desembolso').setValue(null);
    this.creditForm.get('Mon_Gravamen').setValue(null);
    this.creditForm.get('Mon_PrecioVentaId').setValue(null);
    this.creditForm.get('Mon_Ap_Efectivo').setValue(null);
    this.creditForm.get('Mon_Aport_AFPId').setValue(null);
    this.creditForm.get('Mon_BBP').setValue(null);
    this.creditForm.get('Mon_PBB').setValue(null);
  }

  setearTipoMoneda(simbolo: string, idtipo?: number) {
    this.creditForm.get('Mon_BBP').setValue(simbolo);
    this.creditForm.get('Mon_PBB').setValue(simbolo);
    this.creditForm.get('Mon_Desembolso').setValue(simbolo);
    this.creditForm.get('Mon_Gravamen').setValue(simbolo);
  }

  setPlanAhorroEmpty() {
    this.creditForm.get('Meses_Abono').setValue(null);
    this.creditForm.get('Importe_Cuota_Ahorro').setValue(null);
    this.creditForm.get('Tipo_Moneda_AhorroId').setValue(null);
    this.creditForm.get('Situacion_Plan_AhorroId').setValue(null);
    this.creditForm.get('N_Abonos_Validados').setValue(null);
    this.creditForm.get('Ultimo_Abono_ValidadoId').setValue(null);
    this.creditForm.get('Cta_Ahorro_BanBif').setValue(null);
  }

  setPlanAhorroUntouched() {
    this.creditForm.get('Meses_Abono').markAsUntouched();
    this.creditForm.get('Importe_Cuota_Ahorro').markAsUntouched();
    this.creditForm.get('Tipo_Moneda_AhorroId').markAsUntouched();
    this.creditForm.get('Situacion_Plan_AhorroId').markAsUntouched();
    this.creditForm.get('N_Abonos_Validados').markAsUntouched();
    this.creditForm.get('Ultimo_Abono_ValidadoId').markAsUntouched();
    this.creditForm.get('Cta_Ahorro_BanBif').markAsUntouched();
  }

  setMonedaGarantia() {
    this.creditForm.get('Mon_Valor_ComTas_Soles').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_Valor_ComTas_Soles').disable();
    this.creditForm.get('Mon_VRI_Soles').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_VRI_Soles').disable();
  }

  setDisabledControlsBuenPagador() {
    this.creditForm.get('Mon_BBP').disable();
    //this.creditForm.get('BBP').disable();
    this.creditForm.get('Mon_PBB').disable();
    //this.creditForm.get('PBP').disable();
    this.creditForm.get('PBP_Adiconal_Sostenible').disable();
    this.creditForm.controls.Condicion_Desembolso.disable();
  }

  setDisableControlsAplicacion() {
    this.creditForm.get('Numero_Desemboslo').disable();
    this.creditForm.get('Primer_desembolso').disable();
    this.creditForm.get('Segundo_desembolso').disable();
    this.creditForm.get('Tercer_desembolso').disable();
    this.creditForm.get('Aporte_Cliente').disable();
  }

  setDisableControlsPlanAhorroProgramado() {
    this.creditForm.get('Meses_Abono').disable();
    this.creditForm.get('Tipo_Moneda_AhorroId').disable();
    this.creditForm.get('Importe_Cuota_Ahorro').disable();
    this.creditForm.get('Situacion_Plan_AhorroId').disable();
    this.creditForm.get('N_Abonos_Validados').disable();
    this.creditForm.get('Ultimo_Abono_ValidadoId').disable();
    this.creditForm.get('Cta_Ahorro_BanBif').disable();
    this.creditForm.get('Plan_Ahorro').disable();
  }

  setDisableControlsDescripcionInmueble() {
    this.creditForm.get('Descripcion_Inmueble').disable();
    this.creditForm.get('Fecha_Tasacion_Remodelac').disable();
  }

  setDisableObservacionesOpcional() {
    this.creditForm.get('Observaciones').disable();
    this.creditForm.get('Lugar_VisitaId').disable();
    this.creditForm.get('Periodo_Gracia').disable();
  }

  setDisableComentarios() {
    this.creditForm.get('Comentario_Registro').disable();
    this.creditForm.get('Cometario_Revisor').disable();
    this.creditForm.get('Cometario_Evaluacion').disable();
    this.creditForm.get('MotivoObsEvaluacionRiesgoId').disable();
  }

  setDisableComentarioOficina() {
    this.creditForm.get('Desembolso_Ampliacion').disable();
  }

  setDisableComentarioGestor() {
    this.creditForm.get('ComentarioGestor').disable();
  }

  setDisableDesembolsado() {
    this.creditForm.get('Desembolsado').disable();
  }

  setDisableControlsCabezera() {
    this.creditForm.get('Tipo_ProductoId').disable();
    this.creditForm.get('ejecutivo').disable();
    this.creditForm.get('ModalidadId').disable();
    this.creditForm.get('Sub_ProductoId').disable();
    this.creditForm.get('ZonaId').disable();
    this.creditForm.get('OficinaId').disable();
    this.creditForm.get('Tipo_DocumentoId').disable();
    this.creditForm.get('N_Documento').disable();
    this.creditForm.get('Nombre_Titular').disable();
    this.creditForm.get('Riesgo_Maximo').disable();
    this.creditForm.get('Sustento_IngresosId').disable();
    this.creditForm.get('Oferta').disable();
    for (let index = 1; index <= 5; index++) {
      this.creditForm.get(`T${index}`).disable();
      this.creditForm.get(`C${index}`).disable();
    }
  }

  setDisableControlsDatosOperacion() {
    this.creditForm.get('ProyectoId').disable();
    this.creditForm.get('N_ViviendaId').disable();
    this.creditForm.get('MonedaId').disable();
    this.creditForm.get('TEA').disable();
    this.creditForm.get('TEA_AutorizadoId').disable();
    this.creditForm.get('Mon_PrecioVentaId').disable();
    this.creditForm.get('Precio_Venta').disable();
    this.creditForm.get('pFinanciamiento').disable();
  }

  setDisableControlsDesembolso() {
    this.creditForm.get('Desembolso').disable();
    this.creditForm.get('Grabamen').disable();
  }

  setDisableControlsCuotaInicial() {
    this.creditForm.get('Mon_Ap_Efectivo').disable();
    this.creditForm.get('Aporte_Efectivo').disable();
    this.creditForm.get('Mon_Aport_AFPId').disable();
    this.creditForm.get('Aporte_RetiroAFP').disable();
    this.creditForm.get('Mon_Desembolso').disable();
    this.creditForm.get('Desembolso').disable();
    this.creditForm.get('Mon_Gravamen').disable();
    this.creditForm.get('Grabamen').disable();
    this.creditForm.get('Modalidad_PagoId').disable();
    this.creditForm.get('BBP').disable();
    this.creditForm.get('PBP').disable();
  }

  setDisableControlsTipoGarantiaAbono() {
    this.creditForm.get('Tipo_GarantiaId').disable();
    this.creditForm.get('Tipo_AbonoId').disable();
  }

  setDisableControlsGarantias() {
    this.creditForm.get('Descripcion_Inmueble').disable();
    this.creditForm.get('Fecha_Tasacion_Remodelac').disable();
  }

  showInputTextObservacion() {
    this.showObservacionCPM = true;
    this.showComentarioCPM = true;
    this.showComentarioRiesgos = true;
    this.showMotivoObservacionRiesgos = true;
  }

  showInputObservacion() {
    this.showObservacionCPM = false;
    this.showComentarioCPM = true;
    this.showComentarioRiesgos = true;
    this.creditForm.controls.Cometario_Revisor1.disable();
    this.showMotivoObservacionRiesgos = true;
    //this.creditForm.controls.MotivoObsEvaluacionRiesgoId.disable();
  }

  listenerBonoBuenPagador() {

    this.creditForm.get('Precio_Venta').valueChanges.subscribe(selectedValue => {

      selectedValue = parseFloat(selectedValue.toString().replace(",", ""));

      if (selectedValue >= Variables.constantes.PrecioVenta1 && selectedValue <= Variables.constantes.PrecioVenta2ViviendaSostenible) {
        this.showmessageVivienda = false;
      } else {
        if (this.esMiVivienda) {
          this.showmessageVivienda = true;
        } else {
          this.showmessageVivienda = false;
        }
      }

      switch (true) {
        case (selectedValue >= Variables.constantes.PrecioVenta9):
          this.creditForm.get('BBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador5, '-###,###,###,##0.00', 1));
          this.creditForm.get('PBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador5, '-###,###,###,##0.00', 1));
          break;
        case (selectedValue >= Variables.constantes.PrecioVenta7 && selectedValue <= Variables.constantes.PrecioVenta8):
          this.creditForm.get('BBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador4, '-###,###,###,##0.00', 1));
          this.creditForm.get('PBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador6, '-###,###,###,##0.00', 1));
          break;
        case (selectedValue >= Variables.constantes.PrecioVenta5 && selectedValue <= Variables.constantes.PrecioVenta6):
          this.creditForm.get('BBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador3, '-###,###,###,##0.00', 1));
          this.creditForm.get('PBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador5, '-###,###,###,##0.00', 1));
          break;
        case (selectedValue >= Variables.constantes.PrecioVenta3 && selectedValue <= Variables.constantes.PrecioVenta4):
          this.creditForm.get('BBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador2, '-###,###,###,##0.00', 1));
          this.creditForm.get('PBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador5, '-###,###,###,##0.00', 1));
          break;
        case (selectedValue >= Variables.constantes.PrecioVenta1 && selectedValue <= Variables.constantes.PrecioVenta2):
          this.creditForm.get('BBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador1, '-###,###,###,##0.00', 1));
          this.creditForm.get('PBP').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador5, '-###,###,###,##0.00', 1));
          break;
        default:
          this.creditForm.get('BBP').setValue(myExtObject.MASKMONEY(0, '-###,###,###,##0.00', 1));
          this.creditForm.get('PBP').setValue(myExtObject.MASKMONEY(0, '-###,###,###,##0.00', 1));
          break;
      }
    });
  }

  listenerPBPAdicionalSostenible() {

    this.creditForm.controls.BBP_AdicionalId.setValue(Variables.constantes.TipoBonoViviendaAdicionalSostenibleId);
    this.creditForm.get('BBP_AdicionalId').valueChanges.subscribe(idPBP => {

      let precio = this.creditForm.get('Precio_Venta').value;
      if (precio !== null) {
        precio = parseFloat(precio.toString().replace(",", ""));
      } else {
        precio = 0;
      }

      if (idPBP !== Variables.constantes.TipoBonoViviendaAdicionalSostenibleId && precio >= Variables.constantes.PrecioVenta1ViviendaSostenible && precio <= Variables.constantes.PrecioVenta2ViviendaSostenible) {
        this.creditForm.get('PBP_Adiconal_Sostenible').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoAdicionalViviendaSostenible, '-###,###,###,##0.00', 1));
      } else {
        this.creditForm.get('PBP_Adiconal_Sostenible').setValue(myExtObject.MASKMONEY(Variables.constantes.BonoBuenPagador5, '-###,###,###,##0.00', 1));
      }
    });
  }

  listenerBotones() {

    const estado = this.creditForm.get('EstadoId').value;
    const estadoLegal = this.creditForm.get('EstadoLegalId').value;
    const estadoMiVivienda = this.creditForm.get('EstadoMiViviendaId').value;

    debugger;
    if (estadoLegal === Variables.constantes.EstadoGestionLegal && this.PertenceGrupo_U_Legal) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.ComentarioGestor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.mostrarBotones_GestionLegal = true;
      this.mostrarCampo_ComentarioLegal = true;
    }
    else if (estadoLegal === Variables.constantes.EstadoObservadoLegal && this.PertenceGrupo_U_Gestor) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.mostrarCampo_ComentarioLegal = true;
      this.creditForm.controls.ComentarioLegal.disable();

      this.mostrarBotones_ObservadoLegal = true;
    }
    else if (estadoMiVivienda === Variables.constantes.EstadoMiVivienda && this.PertenceGrupo_U_MiVivienda) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.ComentarioGestor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.mostrarCampo_ComentarioLegal = true;
      this.creditForm.controls.ComentarioLegal.disable();

      this.mostrarCampo_ComentarioDesembolso = true;
      this.creditForm.controls.ComentarioDesembolso.disable();

      this.mostrarCampo_ComentarioMiVivienda = true;
      this.mostrarBotones_MiVivienda = true;     
    }
    else if (estadoMiVivienda === Variables.constantes.EstadoEsperaFondos && this.PertenceGrupo_U_MiVivienda) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.ComentarioGestor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.mostrarCampo_ComentarioLegal = true;
      this.creditForm.controls.ComentarioLegal.disable();

      this.mostrarCampo_ComentarioDesembolso = true;
      this.creditForm.controls.ComentarioDesembolso.disable();

      this.mostrarCampo_ComentarioMiVivienda = true;
      this.mostrarBotones_EsperaFondos = true;     
    }
    else if (estadoMiVivienda === Variables.constantes.EstadoObservadoMiVivienda && this.PertenceGrupo_U_Gestor) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.ComentarioGestor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.mostrarCampo_ComentarioLegal = true;
      this.creditForm.controls.ComentarioLegal.disable();

      this.mostrarCampo_ComentarioDesembolso = true;
      this.creditForm.controls.ComentarioDesembolso.disable();

      this.mostrarCampo_ComentarioMiVivienda = true;
      this.creditForm.controls.ComentarioMiVivienda.disable();

      this.mostrarBotones_ObservadoMiVivienda = true;
    }
    else if (estado === Variables.constantes.EstadoCreaExpedienteId) {
      this.showBtnEnviarRegularizar = false;
      this.showBtnObservar = false;
      this.showSaving = true;
      this.setDisabledControlsBuenPagador();
      //this.creditForm.get('Desembolso').disable();
      //this.creditForm.get('Grabamen').disable();
      this.creditForm.get('NumeroPropuesta').disable();
      this.mostrarBotonDesestimiento = true;

      if (!this.PertenceGrupo_U_Oficina) {
        this.setDisableControlsCabezera();
        this.setDisableControlsCuotaInicial();
        this.setDisableControlsDatosOperacion();
        this.setDisableControlsTipoGarantiaAbono();
        this.setDisableObservacionesOpcional();
        this.setDisableControlsAplicacion();
        this.setDisableComentarios();
        this.setDisableControlsPlanAhorroProgramado();
        this.setDisableComentarioOficina();
        this.setDisableComentarioGestor();
        this.showBtnGuardarBorrador = false;
        this.showBtnEnviar = false;
        this.mostrarBotonDesestimiento = false;
      }
    }
    else if (estado === Variables.constantes.EstadoRegistroCPM) {
      this.showBtnGuardarBorrador = false;
      this.showBtnObservarRegistro = true;
      this.showBotonesProducto = false;
      this.showAnalistaRiesgos = true;
      this.showInputTextObservacion();
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableComentarioOficina();
      this.mostrarNumeroPropuesta = true;

      this.showComentarioRiesgos = false;
      this.showMotivoObservacionRiesgos = false;

      this.creditForm.controls.Cometario_Evaluacion.disable();
      this.creditForm.controls.MotivoObsEvaluacionRiesgoId.disable();

      if (!Funciones.esNullOrUndefined(this.creditForm.controls.Cometario_Evaluacion.value)) {
        this.showComentarioRiesgos = true;
      }

      if (!Funciones.esNullOrUndefined(this.creditForm.controls.MotivoObsEvaluacionRiesgoId.value)) {
        this.showMotivoObservacionRiesgos = true;
      }

      this.showBtnObservar = true;

      if (!this.PertenceGrupo_U_CPM) {
        this.creditForm.controls.NumeroPropuesta.disable();
        this.setDisableControlsAplicacion();
        this.setDisableComentarios();
        this.setDisableControlsPlanAhorroProgramado();
        this.setDisableComentarioGestor();
        this.showBtnObservarRegistro = false;
        this.showBtnEnviar = false;
        this.showBtnObservar = false;
      }
    }
    else if (estado === Variables.constantes.EstadoObservadoCPM) {
      this.showBtnEnviarRegularizar = false;
      this.showBtnObservar = false;
      this.showSaving = true;
      this.setDisabledControlsBuenPagador();
      //this.creditForm.get('Desembolso').disable();
      //this.creditForm.get('Grabamen').disable();
      this.creditForm.get('NumeroPropuesta').disable();
      this.mostrarBotonDesestimiento = true;

      this.showComentarioCPM = false;
      this.showObservacionCPM = false;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Observacion_CPMId.disable();

      if (!Funciones.esNullOrUndefined(this.creditForm.controls.Comentario_Registro.value)) {
        this.showComentarioCPM = true;
      }

      if (!Funciones.esNullOrUndefined(this.creditForm.controls.Observacion_CPMId.value)) {
        this.showObservacionCPM = true;
      }

      if (!this.PertenceGrupo_U_Oficina) {
        this.setDisableControlsCabezera();
        this.setDisableControlsCuotaInicial();
        this.setDisableControlsDatosOperacion();
        this.setDisableControlsTipoGarantiaAbono();
        this.setDisableObservacionesOpcional();
        this.setDisableControlsAplicacion();
        this.setDisableComentarios();
        this.setDisableControlsPlanAhorroProgramado();
        this.setDisableComentarioOficina();
        this.setDisableComentarioGestor();
        this.showBtnGuardarBorrador = false;
        this.showBtnEnviar = false;
        this.mostrarBotonDesestimiento = false;
      }
    }
    else if (estado === Variables.constantes.EstadoObservadoRiesgos) {
      this.mostrarBotonDesestimiento = true;
      this.mostrarBotonEnviarRegistroCPM = true;
      this.showComentarioRiesgos = true;
      this.showMotivoObservacionRiesgos = true;
      this.creditForm.controls.Cometario_Evaluacion.disable();
      this.creditForm.controls.MotivoObsEvaluacionRiesgoId.disable();
      this.creditForm.get('NumeroPropuesta').disable();

      if (!this.PertenceGrupo_U_Oficina) {
        this.setDisableControlsCabezera();
        this.setDisableControlsCuotaInicial();
        this.setDisableControlsDatosOperacion();
        this.setDisableControlsTipoGarantiaAbono();
        this.setDisableObservacionesOpcional();
        this.setDisableControlsAplicacion();
        this.setDisableComentarios();
        this.setDisableControlsPlanAhorroProgramado();
        this.setDisableComentarioOficina();
        this.setDisableComentarioGestor();
        this.showBtnGuardarBorrador = false;
        this.showBtnEnviar = false;
        this.mostrarBotonDesestimiento = false;
      }
    }
    else if (estado === Variables.constantes.EstadoEvaluacionRiesgos) {
      this.showBtnObservar = false;
      this.showBotonesProducto = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showBtnAprobarSinVerificacion = true;
      this.showBtnAprobarEnVerificacion = true;
      this.showBtnObservacionOficina = true;
      this.showBtnObservacionCPM = true;
      this.showBtnRechazar = true;
      this.showComentarioRevisor = true;
      this.showAnalistaRiesgos = true;
      this.showInputObservacion();
      this.setDisableControlsCabezera();
      this.setDisableControlsGarantias();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableControlsTipoGarantiaAbono();
      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.setDisableComentarioOficina();
      this.mostrarNumeroPropuesta = true;

      if (!this.PertenceGrupo_U_Evaluacion) {
        this.setDisableControlsCuotaInicial();
        this.setDisableControlsDatosOperacion();
        this.setDisableComentarios();
        this.setDisableComentarioGestor();
        this.showBtnAprobarSinVerificacion = false;
        this.showBtnAprobarEnVerificacion = false;
        this.showBtnObservacionOficina = false;
        this.showBtnObservacionCPM = false;
        this.showBtnRechazar = false;
        this.showComentarioRevisor = false;
        this.showAnalistaRiesgos = false;
      }
    }
    else if (estado === Variables.constantes.EstadoVerificacionRiesgos) {
      this.showBtnObservar = false;
      this.showBotonesProducto = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showBtnAprobar = true;
      this.showBtnRechazar = true;
      this.showBtnCancelar = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.setDisableControlsCabezera();
      this.setDisableControlsDescripcionInmueble();
      this.setDisabledControlsBuenPagador();
      this.setDisableControlsAplicacion();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableControlsTipoGarantiaAbono();
      this.creditForm.controls.NumeroPropuesta.disable();
    }
    else if (estado === Variables.constantes.EstadoAsignacionRiesgos) {
      this.showBtnObservar = false;
      this.showBotonesProducto = false;
      this.showAsignacionRiesgos = false;
      this.showBtnGuardarBorrador = false;
      this.showPlanAhorro = false;
      this.setDisableControlsCabezera();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableControlsTipoGarantiaAbono();
      this.creditForm.get('NumeroPropuesta').disable();
    }
    else if (estado === Variables.constantes.EstadoRegularizacionCPM) {
      this.showBtnObservar = false;
      this.showBotonesProducto = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showBtnEnviarRegularizar = true;
      this.showBtnObservarRegistro = true;
      this.showComentarioRiesgos = true;
      this.creditForm.controls.Cometario_Evaluacion.disable();
      this.creditForm.controls.MotivoObsEvaluacionRiesgoId.disable();
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsPlanAhorroProgramado();
      this.creditForm.get('NumeroPropuesta').disable();
    }
    else if (estado === Variables.constantes.EstadoAprobadoSinVerificacion) {
      this.showBtnObservar = false;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.showAnalistaRiesgos = true;
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showBtnGrabar = true;
      this.showBtnEnviarRegularizar = false;
      this.showControlesGestor = true;
      this.colorBoton = 'rgb(24, 255, 120)';
      this.colorletraBoton = 'black';
      this.creditForm.controls.NumeroPropuesta.disable();
    }
    else if (estado === Variables.constantes.EstadoRechazado) {
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.showAnalistaRiesgos = true;
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showBtnGrabar = true;
      this.showBtnEnviarRegularizar = false;
      this.showControlesGestor = true;
      this.colorBoton = 'rgb(24, 255, 120)';
      this.colorletraBoton = 'black';
      this.creditForm.get('NumeroPropuesta').disable();
    }
    else if (estado === Variables.constantes.EstadoGestionFiles2 || estado === Variables.constantes.EstadoObservadoGestor) {
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();

      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;
      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.mostrarBotonEnviarGestionFiles2 = true;
      this.mostrarBotonDesestimiento = true;

      if (estado === Variables.constantes.EstadoObservadoGestor) {
        this.showComentarioGestor = true;
        this.setDisableComentarioGestor();
      }

      if (!this.PertenceGrupo_U_Oficina) {
        this.setDisableComentarioOficina();
        this.setDisableComentarioGestor();
        this.mostrarBotonEnviarGestionFiles2 = false;
        this.mostrarBotonDesestimiento = false;
      }
    }
    else if (estado === Variables.constantes.EstadoValidacionFiles2) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();
      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.mostrarBotonEnviarValidacionFiles2 = true;
      this.mostrarBotonEnviarObservadoGestor = true;
      this.mostrarBotonDesestimiento = true;
      this.showComentarioGestor = true;

      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;
      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();

      if (!this.PertenceGrupo_U_Asistente_Gestor) {
        this.setDisableComentarioGestor();
        this.mostrarBotonEnviarValidacionFiles2 = false;
        this.mostrarBotonEnviarObservadoGestor = false;
        this.mostrarBotonDesestimiento = false;
      }
    }
    else if (estado === Variables.constantes.EstadoIngresoFile) {
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();
      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;

      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;
      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();

      //this.mostrarBotonEnviarIngresoFiles2 = true;
      this.mostrarBotones_IngresoFiles = true;

      if (!this.PertenceGrupo_U_Gestor) {
        this.setDisableComentarioGestor();
        this.mostrarBotonEnviarIngresoFiles2 = false;
        this.mostrarBotones_IngresoFiles = false;
      }
    }
    else if (estado === Variables.constantes.EstadoDesestimado || estado === Variables.constantes.EstadoPreTerminado) {
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();
      this.setDisableComentarioGestor();
      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showBtnGrabar = false;
      this.showComentarioGestor = true;
      this.creditForm.get('NumeroPropuesta').disable();

      if (estado === Variables.constantes.EstadoPreTerminado) {
        this.showDesembolsado = true;
        this.mostrarBotonGuardarPreTerminado = true;
        if (!this.PertenceGrupo_U_Gestor) {
          this.setDisableDesembolsado();
          this.mostrarBotonGuardarPreTerminado = false;
        }
      }
    }
    else if (estado === Variables.constantes.EstadoRegistroGarantia) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();
      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;

      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;
      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.ComentarioGestor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.creditForm.controls.ComentarioOficinaFile2.disable();
      if (!Funciones.esNullOrUndefined(this.creditForm.controls.ComentarioOficinaFile2.value)) {
        this.mostrarCampo_ComentarioOficinaFile2 = true;
      }

      this.mostrarBotones_RegistroGarantia = true;
      this.mostrarCampo_ComentarioGarantia = true;

      if (!this.PertenceGrupo_U_Garantias) {
        this.creditForm.controls.ComentarioGarantia.disable();
        this.mostrarBotones_RegistroGarantia = false;
      }
    }
    else if (estado === Variables.constantes.EstadoObservadoGarantia) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();
      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;

      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;
      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.ComentarioGestor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();
      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.mostrarBotones_ObservadoGarantia = true;
      this.mostrarCampo_ComentarioOficinaFile2 = true;

      if (!this.PertenceGrupo_U_Gestor) {
        this.creditForm.controls.ComentarioOficinaFile2.disable();
        this.mostrarBotones_ObservadoGarantia = false;
      }
    }
    else if (estado === Variables.constantes.EstadoValidacionGarantia) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.ComentarioGestor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.mostrarBotones_ValidacionGarantia = true;
      this.mostrarCampo_ComentarioValidadorGarantia = true;

      if (!this.PertenceGrupo_U_ValidadorGarantias) {
        this.creditForm.controls.ComentarioValidadorGarantia.disable();
        this.mostrarBotones_ValidacionGarantia = false;
      }

    }
    else if (estado === Variables.constantes.EstadoValidacionGestor) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.creditForm.controls.ComentarioOficinaFile2.disable();
      if (!Funciones.esNullOrUndefined(this.creditForm.controls.ComentarioOficinaFile2.value)) {
        this.mostrarCampo_ComentarioOficinaFile2 = true;
      }

      this.mostrarCampo_ComentarioValidadorGarantia = true;
      this.creditForm.controls.ComentarioValidadorGarantia.disable();

      this.mostrarCampo_ComentarioLegal = true;
      this.creditForm.controls.ComentarioLegal.disable();

      this.mostrarBotones_ValidacionGestor = true;

      const idTipoProducto = this.creditForm.get('Tipo_ProductoId').value;

      debugger;
      if (idTipoProducto === Variables.constantes.TipoProductoMiViviendaId) {
        this.esMiVivienda = true;
      } else {
        this.esMiVivienda = false;
      }

      if (!this.PertenceGrupo_U_Gestor) {
        this.creditForm.controls.ComentarioGestor.disable();
        this.mostrarBotones_ValidacionGestor = false;
      }
    }
    else if (estado === Variables.constantes.EstadoObservadoGestorLegal) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();
      this.creditForm.controls.ComentarioGestor.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.creditForm.controls.ComentarioOficinaFile2.disable();
      if (!Funciones.esNullOrUndefined(this.creditForm.controls.ComentarioOficinaFile2.value)) {
        this.mostrarCampo_ComentarioOficinaFile2 = true;
      }

      this.mostrarCampo_ComentarioValidadorGarantia = true;
      this.creditForm.controls.ComentarioValidadorGarantia.disable();

      this.mostrarCampo_ComentarioLegal = true;
      this.mostrarBotones_ObservadoGestorLegal = true;      
     
      if (!this.PertenceGrupo_U_Legal) {
        this.creditForm.controls.ComentarioLegal.disable();
        this.mostrarBotones_ObservadoGestorLegal = false;
      }
    }
    else if (estado === Variables.constantes.EstadoObservadoGestorDesembolso) {

      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();

      this.showBtnObservar = false;
      this.showBtnGuardarBorrador = false;
      this.showBtnEnviar = false;
      this.showComentarioGestor = true;
      this.showComentarioRiesgos = true;
      this.showComentarioCPM = true;
      this.showComentarioRevisor = true;
      this.mostrarNumeroPropuesta = true;
      this.showAnalistaRiesgos = true;

      this.creditForm.controls.Comentario_Registro.disable();
      this.creditForm.controls.Cometario_Revisor1.disable();
      this.creditForm.controls.Cometario_Revisor.disable();
      this.creditForm.controls.NumeroPropuesta.disable();
      this.creditForm.controls.Analista_Riesgos.disable();
      this.creditForm.controls.UsuarioIngresoFile.disable();
      this.creditForm.controls.ComentarioGestor.disable();

      this.mostrarCampo_ComentarioGarantia = true;
      this.creditForm.controls.ComentarioGarantia.disable();

      this.creditForm.controls.ComentarioOficinaFile2.disable();
      if (!Funciones.esNullOrUndefined(this.creditForm.controls.ComentarioOficinaFile2.value)) {
        this.mostrarCampo_ComentarioOficinaFile2 = true;
      }

      this.mostrarCampo_ComentarioValidadorGarantia = true;
      this.creditForm.controls.ComentarioValidadorGarantia.disable();

      this.mostrarCampo_ComentarioLegal = true;
      this.creditForm.controls.ComentarioLegal.disable();

      this.mostrarBotones_ObservadoGestorDesembolso = true;      
     
      if (!this.PertenceGrupo_U_Oficina) {
        this.creditForm.controls.Desembolso_Ampliacion.disable();
        this.mostrarBotones_ObservadoGestorDesembolso = false;
      }
    }
    else {
      this.setDisableControlsCabezera();
      this.setDisableControlsCuotaInicial();
      this.setDisableControlsDatosOperacion();
      this.setDisableControlsTipoGarantiaAbono();
      this.setDisableObservacionesOpcional();
      this.setDisableControlsAplicacion();
      this.setDisableComentarios();
      this.setDisableControlsPlanAhorroProgramado();
      this.setDisableComentarioOficina();
      this.showBtnObservar = false;
      this.showBtnGrabar = false;
      this.showBtnEnviar = false;
      this.showBtnGuardarBorrador = false;
    }
  }

  listenerTipoGarantia() {
    this.creditForm.get('Tipo_GarantiaId').valueChanges.subscribe(id => {
      if (this.typeguarenteeList !== null && this.typeguarenteeList) {
        const garantias = this.typeguarenteeList.find(item => item.Id === id).Condiciones;
        const cadCondicionDesembolso = garantias.replace(this.expRegular, '');
        this.creditForm.controls.Condicion_Desembolso.setValue(cadCondicionDesembolso);
      }
    });
  }

  listenerTipoMoneda() {
    this.creditForm.get('MonedaId').valueChanges.subscribe(selectedValue => {
      if (selectedValue === Variables.constantes.TipoMonedaDolaresDatosOperacionId) {
        this.setearTipoMoneda(Variables.constantes.SimboloDolares, Variables.constantes.TipoMonedaDolaresPrecioVentaId);
      } else {
        this.setearTipoMoneda(Variables.constantes.SimboloSoles, Variables.constantes.TipoMonedaSolesPrecioVentaId);
      }
    });
  }

  valueSubProducto(): any {
    this.creditForm.get('Tipo_ProductoId').valueChanges.subscribe(selectedValue => {

      this.esMiVivienda = false;
      this.tipoSubProductoList = [];

      switch (selectedValue) {
        case Variables.constantes.TipoProductoMiViviendaId:
          this.setearMonedasSoles();
          this.esMiVivienda = true;
          this.showmessageVivienda = true;
          this.showBotonesProducto = true;
          this.showPVenta = true;
          this.showGarantias = false;
          this.showCuotaInicial = true;
          this.showBuenPagador = true;
          this.showBuenAplicacion = false;
          this.showTipoGarantiaAbono = true;
          break;
        case Variables.constantes.TipoProductoCompraDeudaId:
          this.showBotonesProducto = false;
          this.showPVenta = true;
          this.showmessageVivienda = false;
          this.showGarantias = false;
          this.showCuotaInicial = true;
          this.showBuenPagador = false;
          this.showBuenAplicacion = false;
          this.showTipoGarantiaAbono = true;
          this.setearMonedasEmpty();
          break;
        case Variables.constantes.TipoProductoAmpliacionRemodelacionConstruccionId:
          this.creditForm.controls.Condicion_Desembolso.setValue(`${Variables.condicionesDesembolso.ContratoFirma}
    ${Variables.condicionesDesembolso.PagoAdelantado}
    ${Variables.condicionesDesembolso.ChequeGerencia}`);
          this.showGarantias = true;
          this.showTipoGarantiaAbono = false;
          this.showPVenta = false;
          this.showBotonesProducto = false;
          this.showmessageVivienda = false;
          this.showCuotaInicial = false;
          this.showBuenPagador = false;
          this.showBuenAplicacion = true;
          this.setearMonedasEmpty();
          break;
        case Variables.constantes.TipoProductoHipotecarioId:
          this.showGarantias = false;
          this.showPVenta = true;
          this.showBotonesProducto = true;
          this.showTipoGarantiaAbono = true;
          this.showmessageVivienda = false;
          this.showCuotaInicial = true;
          this.showBuenPagador = false;
          this.showBuenAplicacion = false;
          this.setearMonedasEmpty();
          break;

        default:
          this.showGarantias = false;
          this.showPVenta = true;
          this.showBotonesProducto = true;
          this.showmessageVivienda = false;
          this.showBuenAplicacion = false;
          this.setearMonedasEmpty();
          break;
      }
      this.generalListService.getByField(Variables.listas.AdmTipoSubProducto, Variables.listas.AdmTipoProductoId, selectedValue)
        .then((tipoSubProductoList: any) => this.tipoSubProductoList = tipoSubProductoList)
        .catch(error => console.error(error));
    });
  }

  valueModalidad(): any {
    this.creditForm.get('Tipo_ProductoId').valueChanges.subscribe(selectedValue => {
      // clean array
      this.modalidadList = [];
      this.generalListService.getByField(Variables.listas.AdmModalidad, Variables.listas.AdmModalidadProductoId, selectedValue)
        .then((modalidadList: any) => this.modalidadList = modalidadList)
        .catch(error => console.error(error));
    });
  }

  getZonas() {
    this.generalListService.get(Variables.listas.AdmZona)
      .then(zonaModelList => this.zonaModelList = zonaModelList)
      .catch(error => console.error(error));
  }

  getMotivoObservacionEvaluacionRiesgo() {
    this.generalListService.get(Variables.listas.AdmMotivoObservacionEvaluacionRiesgo)
      .then(motivoList => this.motivoObservacionEvaluacionRiesgoList = motivoList)
      .catch(error => console.error(error));
  }

  valueOficina(): any {
    this.creditForm.get('ZonaId').valueChanges.subscribe(selectedValue => {
      this.oficinaList = [];
      this.generalListService.getByField(Variables.listas.AdmOficina, Variables.listas.AdmZonaId, selectedValue)
        .then((oficinaList: any) => this.oficinaList = oficinaList)
        .catch(error => console.error(error));
    });
  }

  getTypeDocument() {
    this.generalListService.get(Variables.listas.AdmTipoDocumento)
      .then(typeDocumentList => this.typeDocumentList = typeDocumentList)
      .catch(error => console.error(error));
  }

  getSustentoIngresos() {
    this.generalListService.get(Variables.listas.AdmSustentoIngresos)
      .then(sustIngresosList => this.sustIngresosList = sustIngresosList)
      .catch(error => console.error(error));
  }

  getProject() {
    this.generalListService.get(Variables.listas.AdmProyectos, Variables.columns.Title)
      .then(projectList => {
        this.projectList = projectList;
      })
      .catch(error => console.error(error));
  }

  getNVivienda() {
    this.generalListService.get(Variables.listas.AdmNumeroVivienda)
      .then(nviviendaList => this.nviviendaList = nviviendaList)
      .catch(error => console.error(error));
  }

  getCurrencyAporteEfectivo() {
    this.generalListService.get(Variables.listas.AdmTipoMonedaAporteEfectivo)
      .then(currencyAporteEfectivoList => this.currencyAporteEfectivoList = currencyAporteEfectivoList)
      .catch(error => console.error(error));
  }

  getCurrencyAporteAFP() {
    this.generalListService.get(Variables.listas.AdmTipoMonedaAporteAFP)
      .then(currencyAporteAFPList => this.currencyAporteAFPList = currencyAporteAFPList)
      .catch(error => console.error(error));
  }

  getCurrency() {
    this.generalListService.get(Variables.listas.AdmMoneda)
      .then(currencyList => this.currencyList = currencyList)
      .catch(error => console.error(error));
  }

  getTEA() {
    this.generalListService.get(Variables.listas.AdmTEAAutorizada)
      .then(TEAList => this.TEAList = TEAList)
      .catch(error => console.error(error));
  }

  getTypeCurrencyPriceSale() {
    this.generalListService.get(Variables.listas.AdmTipoMonedaPrecioVenta)
      .then(typeCurrencyList => this.typeCurrencyList = typeCurrencyList)
      .catch(error => console.error(error));
  }

  getPaymentMethod() {
    this.generalListService.get(Variables.listas.AdmModalidadPago)
      .then(paymentMethodList => this.paymentMethodList = paymentMethodList)
      .catch(error => console.error(error));
  }

  getVisitingPlace() {
    this.generalListService.get(Variables.listas.AdmLugarVisita)
      .then(visitingPlaceList => this.visitingPlaceList = visitingPlaceList)
      .catch(error => console.error(error));
  }
  getEstadoGestor() {
    this.generalListService.get(Variables.listas.AdmEstadoGestor)
      .then(estadoGestorList => this.estadoGestorList = estadoGestorList)
      .catch(error => console.error(error));
  }

  getvalueGarantias(): any {
    this.creditForm.get('ModalidadId').valueChanges.subscribe(selectedValue => {
      this.generalListService.getByField(Variables.listas.AdmTipoGarantia, Variables.listas.AdmModalidad, selectedValue)
        .then((typeguarenteeList: any) => this.typeguarenteeList = typeguarenteeList)
        .catch(error => console.error(error));
    });
  }

  getPaymentType() {
    this.generalListService.get(Variables.listas.AdmTipoAbono)
      .then(paymentTypeList => this.paymentTypeList = paymentTypeList)
      .catch(error => console.error(error));
  }

  CalificacionTradicional() {
    this.showSaving = false;
    this.showPlanAhorro = false;
    this.setPlanAhorroUntouched();
    this.setPlanAhorroEmpty();
  }

  PlanAhorro() {
    this.showSaving = true;
    this.showPlanAhorro = true;
    this.creditForm.controls.Plan_Ahorro.disable();
  }

  getTypeCurrencySaving() {
    this.generalListService.get(Variables.listas.AdmTipoMonedaAhorro)
      .then(typeCurrencySaving => this.typeCurrencySaving = typeCurrencySaving)
      .catch(error => console.error(error));
  }

  getPlanSituationSaving() {
    this.generalListService.get(Variables.listas.AdmSituacionPlanAhorro)
      .then(planSituationSavingList => this.planSituationSavingList = planSituationSavingList)
      .catch(error => console.error(error));
  }

  getLastValidatedBono() {
    this.generalListService.get(Variables.listas.AdmUltimoAbonoValidado)
      .then(LastValidatedBonoList => this.LastValidatedBonoList = LastValidatedBonoList)
      .catch(error => console.error(error));
  }

  getBBPAdicional() {
    this.generalListService.get(Variables.listas.AdmBBPAdicional)
      .then(BBPAdicionalList => this.BBPAdicionalList = BBPAdicionalList)
      .catch(error => console.error(error));
  }

  getEstado() {
    this.generalListService.get(Variables.listas.AdmEstado)
      .then(estadoList => this.estadoList = estadoList)
      .catch(error => console.error(error));
  }

  getEstadoLegal() {
    this.generalListService.get(Variables.listas.AdmEstadoLegal)
      .then(estadoList => this.estadoLegalList = estadoList)
      .catch(error => console.error(error));
  }

  getEstadoMiVivienda() {
    this.generalListService.get(Variables.listas.AdmEstadoMiVivienda)
      .then(estadoList => this.estadoMiViviendaList = estadoList)
      .catch(error => console.error(error));
  }

  getObjectToSave(): any {
    if (this.creditForm.controls.Meses_Abono.value !== null ||
      this.creditForm.controls.Tipo_Moneda_AhorroId.value !== null ||
      //this.creditForm.controls.Importe_Cuota_Ahorro.value !== null ||
      this.creditForm.controls.Situacion_Plan_AhorroId.value !== null ||
      this.creditForm.controls.N_Abonos_Validados.value !== null ||
      this.creditForm.controls.Ultimo_Abono_ValidadoId.value !== null ||
      this.creditForm.controls.Cta_Ahorro_BanBif.value
    ) {
      this.flagPlanAhorro = Variables.constantes.Flag_PlanAhorro1;

    } else {
      this.flagPlanAhorro = Variables.constantes.Flag_PlanAhorro0;
    }
    const rentaTitular = [];
    const rentaConyugue = [];
    for (let index = 1; index <= 5; index++) {
      this.creditForm.get(`T${index}`).value && (rentaTitular.push(index));
      this.creditForm.get(`C${index}`).value && (rentaConyugue.push(index));
    }

    let ejecutivo = this.IdUsuarioActual;

    if (this.mostrarEjecutivo) {
      ejecutivo = this.getValorControlPeoplePicker('ejecutivo', this.creditForm);
    }

    const analistaRiesgo = this.getValorControlPeoplePicker('Analista_Riesgos', this.creditForm);

    const Fecha_Tasacion_Remodelac = this.creditForm.controls.Fecha_Tasacion_Remodelac.value;
    const Fecha_Gestor_Hip = this.creditForm.controls.Fecha_Gestor_Hip.value;

    let precioVenta = this.creditForm.get('Precio_Venta').value;
    if (precioVenta !== null) {
      precioVenta = parseFloat(precioVenta.toString().replace(",", ""));
    } else {
      precioVenta = 0;
    }

    let AporteEfectivo = this.creditForm.get('Aporte_Efectivo').value;
    if (AporteEfectivo !== null) {
      AporteEfectivo = parseFloat(AporteEfectivo.toString().replace(",", ""));
    } else {
      AporteEfectivo = 0;
    }

    let AporteRetiroAFP = this.creditForm.get('Aporte_RetiroAFP').value;
    if (AporteRetiroAFP !== null) {
      AporteRetiroAFP = parseFloat(AporteRetiroAFP.toString().replace(",", ""));
    } else {
      AporteRetiroAFP = 0;
    }

    let BBP = this.creditForm.get('BBP').value;
    if (BBP !== null) {
      BBP = parseFloat(BBP.toString().replace(",", ""));
    } else {
      BBP = 0;
    }

    let PBP = this.creditForm.get('PBP').value;
    if (PBP !== null) {
      PBP = parseFloat(PBP.toString().replace(",", ""));
    } else {
      PBP = 0;
    }

    let PBPAdicionalSostenible = this.creditForm.get('PBP_Adiconal_Sostenible').value;
    if (PBPAdicionalSostenible !== null) {
      PBPAdicionalSostenible = parseFloat(PBPAdicionalSostenible.toString().replace(",", ""));
    } else {
      PBPAdicionalSostenible = 0;
    }

    let grabamen = this.creditForm.get('Grabamen').value;
    if (grabamen !== null) {
      grabamen = parseFloat(grabamen.toString().replace(",", ""));
    } else {
      grabamen = 0;
    }

    let riesgoMaximo = this.creditForm.get('Riesgo_Maximo').value;
    if (riesgoMaximo !== null) {
      riesgoMaximo = parseFloat(riesgoMaximo.toString().replace(",", ""));
    } else {
      riesgoMaximo = 0;
    }

    const solicitudCreditoHipotecario = {
      Tipo_ProductoId: this.creditForm.controls.Tipo_ProductoId.value,
      Sub_ProductoId: this.creditForm.controls.Sub_ProductoId.value,
      ZonaId: this.creditForm.controls.ZonaId.value,
      ModalidadId: this.creditForm.controls.ModalidadId.value,
      OficinaId: this.creditForm.controls.OficinaId.value,
      Nombre_Titular: this.creditForm.controls.Nombre_Titular.value,
      Tipo_DocumentoId: this.creditForm.controls.Tipo_DocumentoId.value,
      Sustento_IngresosId: this.creditForm.controls.Sustento_IngresosId.value,
      Oferta: this.creditForm.controls.Oferta.value,
      ProyectoId: this.creditForm.controls.ProyectoId.value,
      N_ViviendaId: this.creditForm.controls.N_ViviendaId.value,
      MonedaId: this.creditForm.controls.MonedaId.value,
      TEA_AutorizadoId: this.creditForm.controls.TEA_AutorizadoId.value,
      Mon_PrecioVentaId: this.creditForm.controls.Mon_PrecioVentaId.value,
      Mon_Ap_EfectivoId: this.creditForm.controls.Mon_Ap_Efectivo.value,
      Mon_Aport_AFPId: this.creditForm.controls.Mon_Aport_AFPId.value,
      Mon_BBP: this.creditForm.controls.Mon_BBP.value,
      BBP: BBP,
      Mon_PBB: this.creditForm.controls.Mon_PBB.value,
      Mon_Desembolso: this.creditForm.controls.Mon_Desembolso.value,
      Desembolso: this.creditForm.controls.Desembolso.value,
      Mon_Gravamen: this.creditForm.controls.Mon_Gravamen.value,
      Modalidad_PagoId: this.creditForm.controls.Modalidad_PagoId.value,
      Observaciones: this.creditForm.controls.Observaciones.value,
      Lugar_VisitaId: this.creditForm.controls.Lugar_VisitaId.value,
      Tipo_GarantiaId: this.creditForm.controls.Tipo_GarantiaId.value,
      Tipo_AbonoId: this.creditForm.controls.Tipo_AbonoId.value,
      Condicion_Desembolso: this.creditForm.controls.Condicion_Desembolso.value,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      Numero_Desemboslo: this.creditForm.controls.Numero_Desemboslo.value,
      Primer_desembolso: this.creditForm.controls.Primer_desembolso.value,
      Segundo_desembolso: this.creditForm.controls.Segundo_desembolso.value,
      Tercer_desembolso: this.creditForm.controls.Tercer_desembolso.value,
      Aporte_Cliente: this.creditForm.controls.Aporte_Cliente.value,
      Descripcion_Inmueble: this.creditForm.controls.Descripcion_Inmueble.value,
      Comentario_Registro: this.creditForm.controls.Comentario_Registro.value,
      Cometario_Revisor: this.creditForm.controls.Cometario_Revisor.value,
      Cometario_Evaluacion: this.creditForm.controls.Cometario_Evaluacion.value,
      EstadoGestorId: this.creditForm.controls.EstadoGestorId.value,
      Comentario_Gestor_Hip: this.creditForm.controls.Comentario_Gestor_Hip.value,
      Valor_ComTas_Soles: this.creditForm.controls.Valor_ComTas_Soles.value,
      VRI_Soles: this.creditForm.controls.VRI_Soles.value,
      Meses_Abono: this.creditForm.controls.Meses_Abono.value,
      Tipo_Moneda_AhorroId: this.creditForm.controls.Tipo_Moneda_AhorroId.value,
      Importe_Cuota_Ahorro: this.creditForm.controls.Importe_Cuota_Ahorro.value,
      Situacion_Plan_AhorroId: this.creditForm.controls.Situacion_Plan_AhorroId.value,
      N_Abonos_Validados: this.creditForm.controls.N_Abonos_Validados.value,
      Ultimo_Abono_ValidadoId: this.creditForm.controls.Ultimo_Abono_ValidadoId.value,
      Plan_Ahorro: this.creditForm.controls.Plan_Ahorro.value,
      Cta_Ahorro_BanBif: this.creditForm.controls.Cta_Ahorro_BanBif.value,
      Observacion_CPMId: this.creditForm.controls.Observacion_CPMId.value,
      NumeroPropuesta: this.creditForm.controls.NumeroPropuesta.value,

      Precio_Venta: precioVenta,
      Aporte_Efectivo: AporteEfectivo,
      Aporte_RetiroAFP: AporteRetiroAFP,

      Riesgo_Maximo: riesgoMaximo,
      Tipo_RentaConyugueId: { results: rentaConyugue },
      Anlista_RiesgosId: analistaRiesgo,

      N_Documento: `${this.creditForm.controls.N_Documento.value}`,
      Tipo_RentaId: { results: rentaTitular },
      PBP: PBP,
      Grabamen: grabamen,
      Periodo_Gracia: this.creditForm.controls.Periodo_Gracia.value,
      //TEA: ((+this.creditForm.controls.TEA.value) / 100),
      TEA: this.creditForm.controls.TEA.value,
      Financiamiento: ((this.creditForm.controls.pFinanciamiento.value) / 100),
      Fecha_Tasacion_Remodelac,
      Fecha_Gestor_Hip,
      flag_PlanAhorro: this.flagPlanAhorro,
      EjecutivoId: ejecutivo,
      FechaIngresoRiesgo: this.creditForm.controls.FechaIngresoRiesgo.value
    };

    return solicitudCreditoHipotecario;
  }

  getObservacionesCPM() {
    this.generalListService.get(Variables.listas.AdmObservacionesCPM)
      .then(observacionesCPMList => this.observacionesCPMList = observacionesCPMList)
      .catch(error => console.error(error));
  }

  calculaDesembolso() {

    let precioVenta = this.creditForm.get('Precio_Venta').value;
    if (precioVenta !== null) {
      precioVenta = parseFloat(precioVenta.toString().replace(",", ""));
    } else {
      precioVenta = 0;
    }

    let AporteEfectivo = this.creditForm.get('Aporte_Efectivo').value;
    if (AporteEfectivo !== null) {
      AporteEfectivo = parseFloat(AporteEfectivo.toString().replace(",", ""));
    } else {
      AporteEfectivo = 0;
    }

    let AporteRetiroAFP = this.creditForm.get('Aporte_RetiroAFP').value;
    if (AporteRetiroAFP !== null) {
      AporteRetiroAFP = parseFloat(AporteRetiroAFP.toString().replace(",", ""));
    } else {
      AporteRetiroAFP = 0;
    }

    const tipoProducto = this.creditForm.controls.Tipo_ProductoId.value;

    if (tipoProducto == 1) {

      let BBP = this.creditForm.get('BBP').value;
      if (BBP !== null) {
        BBP = parseFloat(BBP.toString().replace(",", ""));
      } else {
        BBP = 0;
      }

      let PBP = this.creditForm.get('PBP').value;
      if (PBP !== null) {
        PBP = parseFloat(PBP.toString().replace(",", ""));
      } else {
        PBP = 0;
      }

      let PBPAdicionalSostenible = this.creditForm.get('PBP_Adiconal_Sostenible').value;
      if (PBPAdicionalSostenible !== null) {
        PBPAdicionalSostenible = parseFloat(PBPAdicionalSostenible.toString().replace(",", ""));
      } else {
        PBPAdicionalSostenible = 0;
      }

      const Desembolso = precioVenta - AporteEfectivo - AporteRetiroAFP - BBP - PBP - PBPAdicionalSostenible;
      this.Desembolso = Desembolso;
      this.creditForm.get('Desembolso').setValue(myExtObject.MASKMONEY(Desembolso, '-###,###,###,##0.00', 1));

    }
    else {

      const Desembolso = precioVenta - AporteEfectivo - AporteRetiroAFP;
      this.Desembolso = Desembolso;
      this.creditForm.get('Desembolso').setValue(myExtObject.MASKMONEY(Desembolso, '-###,###,###,##0.00', 1));
    }

  }

  ValidarReglasPrecioVenta() {
    this.listenerBonoBuenPagador();
  }

  calculaGravamen() {

    const tipoProducto = this.creditForm.controls.Tipo_ProductoId.value;

    if (tipoProducto == 1) {

      let BBP = this.creditForm.get('BBP').value;
      if (BBP !== null) {
        BBP = parseFloat(BBP.toString().replace(",", ""));
      } else {
        BBP = 0;
      }

      let PBP = this.creditForm.get('PBP').value;
      if (PBP !== null) {
        PBP = parseFloat(PBP.toString().replace(",", ""));
      } else {
        PBP = 0;
      }

      let PBPAdicionalSostenible = this.creditForm.get('PBP_Adiconal_Sostenible').value;
      if (PBPAdicionalSostenible !== null) {
        PBPAdicionalSostenible = parseFloat(PBPAdicionalSostenible.toString().replace(",", ""));
      } else {
        PBPAdicionalSostenible = 0;
      }

      const montoTotal = (this.Desembolso + BBP + PBP + PBPAdicionalSostenible);

      if (montoTotal > 0) {
        const Grabamen = montoTotal * 120 / 100;
        this.creditForm.get('Grabamen').setValue(myExtObject.MASKMONEY(Grabamen, '-###,###,###,##0.00', 1));
      } else {
        const Grabamen = 0;
        this.creditForm.get('Grabamen').setValue(myExtObject.MASKMONEY(Grabamen, '-###,###,###,##0.00', 1));
      }

    }
    else {

      const montoTotal = (this.Desembolso);

      if (montoTotal > 0) {
        const Grabamen = montoTotal * 120 / 100;
        this.creditForm.get('Grabamen').setValue(myExtObject.MASKMONEY(Grabamen, '-###,###,###,##0.00', 1));
      } else {
        const Grabamen = 0;
        this.creditForm.get('Grabamen').setValue(myExtObject.MASKMONEY(Grabamen, '-###,###,###,##0.00', 1));
      }
    }
  }

  updateValue(value: string) {
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('', 'wide'));
  }

  removePeople(): void {
    this.creditForm.get('Ejecutivo').setValue([]);
    this.creditForm.controls['Ejecutivo'].updateValueAndValidity();
  }

  removeAnalista(): void {
    this.creditForm.get('Analista_Riesgos').setValue([]);
    this.creditForm.controls['Analista_Riesgos'].updateValueAndValidity();
  }

  removeUsuarioIngresoFile(): void {
    this.creditForm.get('UsuarioIngresoFile').setValue([]);
    this.creditForm.controls['UsuarioIngresoFile'].updateValueAndValidity();
  }

  saveDraft(): void {

    if (this.creditForm.invalid) {
      this.mostrarCamposObligatorios = true;
      this.mostrarModalInformativo("Mensaje de Validación", 'Completar los campos obligatorios.');
      return;
    }

    this.showLoading();

    debugger;

    const solicitudCreditoHipotecario = this.getObjectToSave();
    if (!this.mostrarEjecutivo) {
      solicitudCreditoHipotecario.EstadoId = Variables.constantes.EstadoCreaExpedienteId;
    }

    const id = this.ItemSolicitud && this.ItemSolicitud.Id ? this.ItemSolicitud.Id : 0;

    this.solicitudService.save(id, solicitudCreditoHipotecario)
      .then(resp => {
        if (resp) {
          this.hideLoading();
          this.showSuccessMessage('El Borrador se Guardo Correctamente');

          this.router.navigate(['/bandejas/consultas']);
        } else {
          this.hideLoading();
          this.showErrorMessage('no se grabó el registro');
        }
      })
      .catch(error => {
        this.hideLoading();
        this.showErrorMessage('no se grabó el registro');
      });

  }

  send() {

    if (this.creditForm.invalid) {
      this.mostrarCamposObligatorios = true;
      this.mostrarModalInformativo("Mensaje de Validación", 'Completar los campos obligatorios.');
      return;
    }

    if (this.creditForm.controls.EstadoId.value === Variables.constantes.EstadoRegistroCPM) {

      const analistaRiesgo = this.getValorControlPeoplePicker('Analista_Riesgos', this.creditForm);

      if (analistaRiesgo === 0) {
        this.mostrarModalInformativo("Mensaje de Validación", 'Ingrese en Analista de Riesgo.');
        return;
      }
    }

    const EstadoIdOld = this.creditForm.controls.EstadoId.value;
    // let Fecha_Registro_CPM: Date;
    let EstadoId = 0;
    [0, Variables.constantes.EstadoCreaExpedienteId].includes(EstadoIdOld) && (EstadoId = Variables.constantes.EstadoRegistroCPM);
    EstadoIdOld === Variables.constantes.EstadoObservadoCPM && (EstadoId = Variables.constantes.EstadoRegistroCPM);
    EstadoIdOld === Variables.constantes.EstadoObservadoRiesgos && (EstadoId = Variables.constantes.EstadoEvaluacionRiesgos);
    EstadoIdOld === Variables.constantes.EstadoRegistroCPM && (EstadoId = Variables.constantes.EstadoEvaluacionRiesgos);
    EstadoIdOld === Variables.constantes.EstadoAsignacionRiesgos && (EstadoId = Variables.constantes.EstadoEvaluacionRiesgos);

    let fechaIngresoRiesgo = this.creditForm.controls.FechaIngresoRiesgo.value;
    if (fechaIngresoRiesgo === null && EstadoId === Variables.constantes.EstadoEvaluacionRiesgos) {
      fechaIngresoRiesgo = new Date();
    }

    const itemSave = this.getObjectToSave();
    itemSave.EstadoId = EstadoId;
    itemSave.Fecha_Estado = new Date();
    itemSave.FechaIngresoRiesgo = fechaIngresoRiesgo;
    // Fecha_Registro_CPM && (itemSave.Fecha_Registro_CPM = Fecha_Registro_CPM);
    Swal.fire({
      title: '¿Está seguro de Enviar la Solicitud?',
      showCancelButton: true,
      confirmButtonText: `Enviar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se envio', 'No se pudo enviar la Solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  observationReview(): void {
    const itemSave = {
      EstadoId: 31 // TODO, create constant
    };

    Swal.fire({
      title: '¿Está seguro de pasar la Solicitud a Revision de Observaciones?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud paso a revisión', 'No se pudo pasar la Solicitud para su revisión');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  approve(): void {
    const itemSave = {
      //EstadoId: 34,
      EstadoId: 38, // TODO, create constant
      Fecha_Aprob_Verifica: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de Aprobar la Solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aprobar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se Aprobó', 'No se pudo Aprobar la Solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  approveWithoutVerification(): void {
    const itemSave = {
      //EstadoId: 33
      EstadoId: 38, // TODO, create constant
      Fecha_AprobSVerifica: new Date(),
      Cometario_Evaluacion: this.creditForm.controls.Cometario_Evaluacion.value
    };

    Swal.fire({
      title: '¿Está seguro de aprobar la Solicitud sin Verificación?',
      showCancelButton: true,
      confirmButtonText: `Aprobar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se Aprobó sin Verificación', 'No se pudo aprobar la Solicitud sin Verificación');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  inVerification(): void {
    const itemSave = {
      EstadoId: 32, // TODO, create constant
      Fecha_Estado: new Date(),
      Fecha_Desestimado: new Date(),
      Cometario_Evaluacion: this.creditForm.controls.Cometario_Evaluacion.value
    };
    Swal.fire({
      title: '¿Está seguro de pasar la Solicitud para su Verificación?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud pasó a verificación', 'No se pudo enviar la Solicitud para su verificación');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  officeObservation(): void {
    const itemSave = {
      EstadoId: 5, // TODO, create constant
      Fecha_Estado: new Date(),
      FechaObs_Evaluacion: new Date(),
      FechaObservacionRiesgo: new Date(),
      Cometario_Evaluacion: this.creditForm.controls.Cometario_Evaluacion.value,
      MotivoObsEvaluacionRiesgoId: this.creditForm.controls.MotivoObsEvaluacionRiesgoId.value
    };
    Swal.fire({
      title: '¿Está seguro de pasar la Solicitud a Observación de Oficina?',
      showCancelButton: true,
      confirmButtonText: `Observar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud pasó a Observación de Oficina', 'No se pudo pasar la Solicitud a Observación de Oficina');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });
  }

  cpmObservation(): void {
    const itemSave = {
      EstadoId: 37, // TODO, create constant
      Fecha_Estado: new Date()
    };
    Swal.fire({
      title: '¿Está seguro de enviar la Solicitud a Observación CPM?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud pasó a Observación CPM', 'No se pudo pasar la Solicitud a Observación CPM');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  rejected(): void {
    this.showLoading();
    const itemSave = {
      EstadoId: 6, // TODO, create constant
      Fecha_Rechazado_Evaluacion: new Date()
    };
    Swal.fire({
      title: 'Esta seguro de Rechazar la Solicitud?',
      text: 'No podrá revertir los CamBios!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, rechazar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'Ha rechazado la solicitud', 'No se pudo rechazar la Solicitud');
      }
    });
  }

  update(itemSave: any, successMessage: string, errorMessage: string): void {
    const id = this.ItemSolicitud && this.ItemSolicitud.Id ? this.ItemSolicitud.Id : 0;
    this.solicitudService.save(id, itemSave)
      .then(resp => {
        console.log(resp);
        if (resp) {
          this.hideLoading();
          this.showSuccessMessage(successMessage);
          this.router.navigate(['/bandejas/consultas']);
        } else {
          this.hideLoading();
          this.showErrorMessage(errorMessage);
        }
      })
      .catch(error => {
        this.hideLoading();
        this.showErrorMessage(errorMessage);
      });
  }

  save(): void {
    const itemSave = this.getObjectToSave();
    this.update(itemSave, 'La Solicitud se actualizó', 'No se pudo actualizar la Solicitud');
  }

  cancel(): void {

  }

  gesionFiles2(): void {
    const itemSave = {
      EstadoId: 38,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la Solicitud a Gestión de Files?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se Envio a Gestión de Files', 'No se pudo enviar a Gestión de Files');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });
  }

  enviarGestionFiles2(): void {
    const itemSave = {
      EstadoId: 39,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la Solicitud a Validación de Files?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se Envio a Validación de Files', 'No se pudo enviar a Validación de Files');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });
  }

  eventoEnviarValidacionFiles2(): void {

    const usuarioIngresoFile = this.getValorControlPeoplePicker('UsuarioIngresoFile', this.creditForm);

    if (usuarioIngresoFile === 0) {
      this.mostrarModalInformativo("Mensaje de Validación", 'Ingrese el usuario de Ingreso de File.');
      return;
    }

    const itemSave = {
      EstadoId: 43,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      UsuarioIngresoFileId: usuarioIngresoFile,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la Solicitud a Ingreso de File?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se Envio a Ingreso de File', 'No se pudo enviar a Ingreso de File');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });
  }

  enviarRegistroCPM(): void {
    const itemSave = {
      EstadoId: 2,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Registro CPM?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Registro CPM', 'No se pudo enviar a Registro CPM');
      } else if (result.isDismissed) {
        Swal.fire('No se ha enviado la Solicitud', '', 'info');
      }
    });
  }

  enviarDesestimiento(): void {
    const itemSave = {
      EstadoId: 40,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de Desestimar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se ha Desestimado', 'No se pudo Desestimar');
      } else if (result.isDismissed) {
        Swal.fire('No se ha Desestimado la Solicitud', '', 'info');
      }
    });
  }

  eventoObservarCPM(): void {

    if (this.creditForm.controls.Observacion_CPMId.value === null) {
      this.mostrarModalInformativo("Mensaje de Validación", 'Seleccione el motivo de observación.');
      return;
    }

    const itemSave = {
      EstadoId: 3,
      ComentarioGestor: this.creditForm.controls.Comentario_Registro.value,
      Observacion_CPMId: this.creditForm.controls.Observacion_CPMId.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de Observar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se ha Observado', 'No se pudo Observar');
      } else if (result.isDismissed) {
        Swal.fire('No se ha Observado la Solicitud', '', 'info');
      }
    });
  }

  enviarObservadoGestor(): void {
    const itemSave = {
      EstadoId: 41,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de Observar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se ha Observado', 'No se pudo Observar');
      } else if (result.isDismissed) {
        Swal.fire('No se ha Observado la Solicitud', '', 'info');
      }
    });
  }

  guardarPreTerminado(): void {

    const itemSave = {
      Desembolsado: this.creditForm.controls.Desembolsado.value
    };

    Swal.fire({
      title: '¿Está seguro de guardar?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se ha guardado', 'No se pudo Guardar');
      } else if (result.isDismissed) {
        Swal.fire('No se ha guardado la Solicitud', '', 'info');
      }
    });
  }

  eventoEnviarIngresoFiles2(): void {

    const itemSave = {
      EstadoId: 42,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Pre-Terminado?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Pre-Terminado', 'No se pudo enviar la solicitud a Pre-Terminado');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Pre-Terminado', '', 'info');
      }
    });
  }

  eventoBotonEnviarRegistroGarantia_IngresoFiles(): void {

    const itemSave = {
      EstadoId: 44,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date(),
      EstadoLegalId: 1,
      EnLegal: true
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Registro de Garantía y Gestión Legal?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Registro de Garantía y Gestión Legal.', 'No se pudo enviar la solicitud a Registro de Garantía y Gestión Legal');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Registro de Garantía y Gestión Legal', '', 'info');
      }
    });
  }

  eventoBotonEnviarGestionLegal_IngresoFiles(): void {

    const itemSave = {
      EstadoId: 47,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Gestión Legal?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Gestión Legal.', 'No se pudo enviar la solicitud a Gestión Legal');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Gestión Legal', '', 'info');
      }
    });
  }

  eventoBotonObservar_RegistroGarantia(): void {

    const itemSave = {
      EstadoId: 45,
      ComentarioGarantia: this.creditForm.controls.ComentarioGarantia.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de observar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha observado.', 'No se pudo observar la solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo observar la solicitud', '', 'info');
      }
    });
  }

  eventoBotonEnviar_RegistroGarantia(): void {

    const itemSave = {
      EstadoId: 46,
      ComentarioGarantia: this.creditForm.controls.ComentarioGarantia.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Validación de Garantía?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Validación de Garantía.', 'No se pudo enviar la solicitud a Validación de Garantía');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Validación de Garantía', '', 'info');
      }
    });
  }

  eventoBotonEnviar_ObservadoGarantia(): void {

    const itemSave = {
      EstadoId: 44,
      ComentarioOficinaFile2: this.creditForm.controls.ComentarioOficinaFile2.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Registro de Garantía?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Registro de Garantía.', 'No se pudo enviar la solicitud a Registro de Garantía');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Registro de Garantía', '', 'info');
      }
    });
  }

  eventoBotonDesestimar_ObservadoGarantia(): void {
    const itemSave = {
      EstadoId: 40,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      ComentarioOficinaFile2: this.creditForm.controls.ComentarioOficinaFile2.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de Desestimar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se ha Desestimado', 'No se pudo Desestimar');
      } else if (result.isDismissed) {
        Swal.fire('No se ha Desestimado la Solicitud', '', 'info');
      }
    });
  }

  eventoBotonObservar_ValidacionGarantia(): void {

    const itemSave = {
      EstadoId: 44,
      ComentarioValidadorGarantia: this.creditForm.controls.ComentarioValidadorGarantia.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de observar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha observado.', 'No se pudo observar la solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo observar la solicitud', '', 'info');
      }
    });
  }

  eventoBotonEnviar_ValidacionGarantia(): void {

    const estadoLegal = this.creditForm.get('EstadoLegalId').value;

    if (estadoLegal === Variables.constantes.ValidadoLegal) {

      const itemSave = {
        EstadoId: 49,
        ComentarioValidadorGarantia: this.creditForm.controls.ComentarioValidadorGarantia.value,
        Fecha_Estado: new Date(),
        EnLegal: false,
        EnGestor: false
      };

      Swal.fire({
        title: '¿Está seguro de enviar la solicitud a Validación Gestor?',
        showCancelButton: true,
        confirmButtonText: `Aceptar`, icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showLoading();
          this.update(itemSave, 'La solicitud se ha enviado a Validación Gestor.', 'No se pudo enviar la solicitud a Validación Gestor');
        } else if (result.isDismissed) {
          Swal.fire('No se pudo enviar la solicitud a Validación Gestor', '', 'info');
        }
      });

    } else {
      const itemSave = {
        EstadoId: 47,
        ComentarioValidadorGarantia: this.creditForm.controls.ComentarioValidadorGarantia.value,
        Fecha_Estado: new Date()
      };

      Swal.fire({
        title: '¿Está seguro de enviar la solicitud a Estado Validado por Garantía?',
        showCancelButton: true,
        confirmButtonText: `Aceptar`, icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showLoading();
          this.update(itemSave, 'La solicitud se ha enviado a Estado Validado por Garantía.', 'No se pudo enviar la solicitud a Estado Validado por Garantía');
        } else if (result.isDismissed) {
          Swal.fire('No se pudo enviar la solicitud a Estado Validado por Garantía', '', 'info');
        }
      });
    }
  }

  eventoBotonObservar_GestionLegal(): void {

    const itemSave = {
      ComentarioLegal: this.creditForm.controls.ComentarioLegal.value,
      EstadoLegalId: 2,
      EnLegal: false,
      EnGestor: true
    };

    Swal.fire({
      title: '¿Está seguro de observar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha observado.', 'No se pudo observar la solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo observar la solicitud', '', 'info');
      }
    });
  }

  eventoBotonEnviar_GestionLegal(): void {

    const estado = this.creditForm.get('EstadoId').value;

    if (estado === Variables.constantes.EstadoValidadoGarantia) {
      const itemSave = {
        EstadoId: 49,
        ComentarioLegal: this.creditForm.controls.ComentarioLegal.value,
        Fecha_Estado: new Date(),
        EstadoLegalId: 3,
        EnLegal: false,
        EnGestor: false
      };

      Swal.fire({
        title: '¿Está seguro de enviar la solicitud a Validación Gestor?',
        showCancelButton: true,
        confirmButtonText: `Aceptar`, icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showLoading();
          this.update(itemSave, 'La solicitud se ha enviado a Validación Gestor.', 'No se pudo enviar la solicitud a Validación Gestor');
        } else if (result.isDismissed) {
          Swal.fire('No se pudo enviar la solicitud a Validación Gestor', '', 'info');
        }
      });

    } else {

      const itemSave = {
        EstadoLegalId: 3,
        ComentarioLegal: this.creditForm.controls.ComentarioLegal.value,
        EnLegal: false,
        EnGestor: false
      };

      Swal.fire({
        title: '¿Está seguro de enviar la solicitud a Estado Legal Validado?',
        showCancelButton: true,
        confirmButtonText: `Aceptar`, icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showLoading();
          this.update(itemSave, 'La solicitud se ha enviado a Estado Legal Validado.', 'No se pudo enviar la solicitud a Estado Legal Validado');
        } else if (result.isDismissed) {
          Swal.fire('No se pudo enviar la solicitud a Estado Legal Validado', '', 'info');
        }
      });
    }
  }

  eventoBotonDesestimar_ObservadoLegal(): void {

    const itemSave = {
      EstadoId: 40,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date(),
      EnLegal: false,
      EnGestor: false
    };

    Swal.fire({
      title: '¿Está seguro de Desestimar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se ha Desestimado', 'No se pudo Desestimar');
      } else if (result.isDismissed) {
        Swal.fire('No se ha Desestimado la Solicitud', '', 'info');
      }
    });
  }

  eventoBotonEnviar_ObservadoLegal(): void {

    const itemSave = {
      EstadoLegalId: 1,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      EnLegal: true,
      EnGestor: false
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Estado Legal Gestión Legal?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Estado Legal Gestión Legal.', 'No se pudo enviar la solicitud a Estado Legal Gestión Legal');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Estado Legal Gestión Legal', '', 'info');
      }
    });
  }

  eventoBotonObservarLegal_ValidacionGestor(): void {

    const itemSave = {
      EstadoId: 50,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date(),
      EnLegal: true
    };

    Swal.fire({
      title: '¿Está seguro de observar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha observado.', 'No se pudo observar la solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo observar la solicitud', '', 'info');
      }
    });
  }

  eventoBotonObservarOficina_ValidacionGestor(): void {

    const itemSave = {
      EstadoId: 51,
      ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de observar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha observado.', 'No se pudo observar la solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo observar la solicitud', '', 'info');
      }
    });
  }

  eventoBotonEnviar_ValidacionGestor(): void {

    if (this.esMiVivienda) {

      const itemSave = {
        EstadoId: 55,
        ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
        Fecha_Estado: new Date(),
        EstadoMiViviendaId: 1,
        EnMiVivienda: true,
        EnLegal: false,
        EnGestor: false
      };

      Swal.fire({
        title: '¿Está seguro de enviar la solicitud a Mi Vivienda y Validación de Desembolso?',
        showCancelButton: true,
        confirmButtonText: `Aceptar`, icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showLoading();
          this.update(itemSave, 'La solicitud se ha enviado a Mi Vivienda y Validación de Desembolso.', 'No se pudo enviar la solicitud a Mi Vivienda y Validación de Desembolso');
        } else if (result.isDismissed) {
          Swal.fire('No se pudo enviar la solicitud a Mi Vivienda y Validación de Desembolso', '', 'info');
        }
      });

    } else {
      const itemSave = {
        EstadoId: 55,
        ComentarioGestor: this.creditForm.controls.ComentarioGestor.value,
        Fecha_Estado: new Date()
      };

      Swal.fire({
        title: '¿Está seguro de enviar la solicitud a Validación Desembolso?',
        showCancelButton: true,
        confirmButtonText: `Aceptar`, icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showLoading();
          this.update(itemSave, 'La solicitud se ha enviado a Validación Desembolso.', 'No se pudo enviar la solicitud a Validación Desembolso');
        } else if (result.isDismissed) {
          Swal.fire('No se pudo enviar la solicitud a Validación Desembolso', '', 'info');
        }
      });
    }
  }

  eventoBotonEnviar_ObservadoGestorLegal(): void {

    const itemSave = {
      EstadoId: 49,
      ComentarioLegal: this.creditForm.controls.ComentarioLegal.value,
      Fecha_Estado: new Date(),
      EnLegal: false
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Estado Validación Gestor?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Estado Validación Gestor.', 'No se pudo enviar la solicitud a Estado Validación Gestor');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Estado Validación Gestor', '', 'info');
      }
    });
  }

  eventoBotonDesestimar_ObservadoGestorDesembolso(): void {

    const itemSave = {
      EstadoId: 40,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      Fecha_Estado: new Date(),
      EnLegal: false,
      EnGestor: false
    };

    Swal.fire({
      title: '¿Está seguro de Desestimar la solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La Solicitud se ha Desestimado', 'No se pudo Desestimar');
      } else if (result.isDismissed) {
        Swal.fire('No se ha Desestimado la Solicitud', '', 'info');
      }
    });
  }

  eventoBotonEnviar_ObservadoGestorDesembolso(): void {

    const itemSave = {
      EstadoId: 49,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      Fecha_Estado: new Date()
    };

    Swal.fire({
      title: '¿Está seguro de enviar la solicitud a Estado Validación Gestor?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`, icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.update(itemSave, 'La solicitud se ha enviado a Estado Validación Gestor.', 'No se pudo enviar la solicitud a Estado Validación Gestor');
      } else if (result.isDismissed) {
        Swal.fire('No se pudo enviar la solicitud a Estado Validación Gestor', '', 'info');
      }
    });
  }

}
