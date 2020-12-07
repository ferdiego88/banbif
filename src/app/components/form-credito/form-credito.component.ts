import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit, ApplicationRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GeneralListService } from '../../shared/services/general-list.service';
import { MasterService } from '../../shared/services/master.service';
import { TipoProductoModel, TipoSubProductoModel, ZonaModel, SolicitudCreditoHipotecario } from '../../shared/models/fisics';
import { Variables } from 'src/app/shared/variables';
import {formatCurrency, getCurrencySymbol} from '@angular/common';

// import {default as _rollupMoment} from 'moment';
import * as _moment from 'moment';
const moment = _moment;
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormularioBase } from '../../shared/pages/formularioBase';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerVisibilityService } from 'ng-http-loader';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY'
  }
};

@Component({
  selector: 'app-form-credito',
  templateUrl: './form-credito.component.html',
  styleUrls: ['./form-credito.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],

})
export class FormCreditoComponent extends FormularioBase implements OnInit {
  date = new FormControl(moment());


  solicitudHipotecarioList: SolicitudCreditoHipotecario;
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
  paymentTypeList: TipoProductoModel[];
  tipoSubProductoList: TipoSubProductoModel[];
  estadoList: TipoProductoModel[];
  observacionesCPMList: TipoProductoModel[];
  zonaModelList: ZonaModel;


  typeCurrencySaving: TipoProductoModel[];
  planSituationSavingList: TipoProductoModel[];
  LastValidatedBonoList: TipoProductoModel[];

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
  showControlesGestor = false;
  showComentarioRevisor = false;

  showBtnObservacionCPM = false;
  showBtnAprobar = false;
  showBtnAprobarSinVerificacion = false;
  showBtnAprobarEnVerificacion = false;
  showBtnObservacionOficina = false;
  showBtnRechazar = false;
  showBtnObservarRegistro = false;

  showBtnGuardarBorrador = true;
  showBtnCancelar = true;
  showBtnEnviar = true;
  showBtnEnviarRegularizar = true;
  showBtnGrabar = false;
  showBtnObservar = true;
  showAsignacionRiesgos = true;

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
  events: string[] = [];
  descripcionDocumentos = '';
  enlaceDocumentos = '';
  valueCondicionDesembolso = '';


 creditForm = this.fb.group({
    typeProduct: [null, Validators.required],
    ejecutivo: [null, Validators.required],
    subProducto: [null, Validators.required],
    zona: [null, Validators.required],
    modalidad: [null, Validators.required],
    oficina: [null, Validators.required],
    Estado: [0, Validators.required],
    tipoDcmto: [null, Validators.required],
    nroDcmto: [null, [Validators.required, Validators.maxLength(11)]],
    nombreTitular: [null, Validators.required],
    riesgoMaximo: [null, Validators.required],
    sustentoIngresos: [null, Validators.required],
    Oferta: [null, Validators.required],
    T1: [null, Validators.required],
    T2: [null, Validators.required],
    T3: [null, Validators.required],
    T4: [null, Validators.required],
    T5: [null, Validators.required],
    C1: [null, Validators.required],
    C2: [null, Validators.required],
    C3: [null, Validators.required],
    C4: [null, Validators.required],
    C5: [null, Validators.required],
    nombreProyecto: [null, Validators.required],
    numeroVivienda: [null, Validators.required],
    tipoMoneda: [null, Validators.required],
    Moneda: [null, Validators.required],
    TEA: [null, Validators.required],
    teaAuth: [null, Validators.required],
    tipoprecioVenta: [null, Validators.required],
    precioVenta: [null, Validators.required],
    pFinanciamiento: [null, Validators.required],
    monedaDesembolso: [null, Validators.required],
    desembolso: [null, Validators.required],
    monedagravamen: [null, Validators.required],
    Mon_BBP: [null, Validators.required],
    Mon_PBB: [null, Validators.required],
    BBP: [null, Validators.required],
    PBP: [null, Validators.required],
    gravamen: [null, Validators.required],
    modalidadPago: [null, Validators.required],
    lugarVisita: [null, Validators.required],
    periodoGracia: [null, Validators.required],
    tipoGarantia: [null, Validators.required],
    tipoAbono: [null, Validators.required],
    /* Plan Ahorro*/
    Meses_Abono: [null, Validators.required],
    Tipo_Moneda_Ahorro: [null, Validators.required],
    Importe_Cuota_Ahorro: [null, Validators.required],
    Situacion_Plan_Ahorro: [null, Validators.required],
    N_Abonos_Validados: [null, Validators.required],
    Ultimo_Abono_Validado: [null, Validators.required],
    Cta_Ahorro_BanBif: [null, Validators.required],
    Plan_Ahorro: [null, Validators.required],
    /*Fin Plan Ahorro */

    /* Cuota Inicial*/
    Mon_Ap_Efectivo: [null, Validators.required],
    Aporte_Efectivo: [null, Validators.required],
    Mon_Aport_AFP: [null, Validators.required],
    Aporte_RetiroAFP: [null, Validators.required],
    BBP_Adicional: [null, Validators.required],
    PBP_Adiconal_Sostenible: [null, Validators.required],
    /* Fin Cuota Inicial*/

    /* Ini Garantias*/
    Descripcion_Inmueble: [null, Validators.required],
    Fecha_Tasacion_Remodelac: [new Date(), Validators.required],
    Fecha_Gestor: [new Date(), Validators.required],
    Mon_Valor_ComTas_Soles: [null, Validators.required],
    Valor_ComTas_Soles: [null, Validators.required],
    Mon_VRI_Soles: [null, Validators.required],
    VRI_Soles: [null, Validators.required],
    /* Fin Garantias*/

    Numero_Desemboslo: [null, Validators.required],
    Primer_desembolso: [null, Validators.required],
    Segundo_desembolso: [null, Validators.required],
    Tercer_desembolso: [null, Validators.required],
    Aporte_Cliente: [null, Validators.required],
    Observaciones: [null, Validators.required],
    Observacion_CPMId: [null, Validators.required],
    Observacion_CPM: [null, Validators.required],
    Comentario_Registro: [null, Validators.required],
    Cometario_Revisor: [null, Validators.required],
    Cometario_Evaluacion: [null, Validators.required],
    Condicion_Desembolso: [null, Validators.required],
    Condicion_Desembolso1: [null, Validators.required],
    Desembolso_Ampliacion: [null, Validators.required],
    Enlace_Documentos: [null, Validators.required],
    Anlista_RiesgosId: [null, Validators.required],

    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;

  monedas = [
    {name: 'Soles', abbreviation: 'S/'},
    {name: 'Dolares', abbreviation: 'USD'},

  ];

desembolso = 0;

  condicion = {
    textoContrato : Variables.condicionesDesembolso.ContratoFirma,
    textoPagoAdelantado : Variables.condicionesDesembolso.PagoAdelantado,
    textoChequeGerencia : Variables.condicionesDesembolso.ChequeGerencia
    };

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
    public spinner: SpinnerVisibilityService
  ) {
    super('Solicitud de Crédito Hipotecario', applicationRef, dialog, route, router, masterService, zone, spinner);
  }

  ngOnInit() {
   this.cargarCombos();
   this.getidParams();
   this.cargarListeners();
   this.creditForm.get('Estado').disable();
   this.setDisableControlsDesembolso();
  }

  getidParams(){
    this.route.params.subscribe(
      param => {
        if (param.id) {
          this.solicitudService.getItemById(param.id)
            .then(solicitudHipotecarioList => {
              this.solicitudHipotecarioList = solicitudHipotecarioList[0];

              if (solicitudHipotecarioList[0].EjecutivoId) {
                  const ejecutivo = {
                  Id: solicitudHipotecarioList[0].Ejecutivo.Id,
                  Title: solicitudHipotecarioList[0].Ejecutivo.Title
                };
                  this.creditForm.controls.ejecutivo.setValue([ejecutivo]);
               }


              this.creditForm.controls.typeProduct.setValue(this.solicitudHipotecarioList.Tipo_ProductoId);
              this.creditForm.controls.subProducto.setValue(this.solicitudHipotecarioList.Sub_ProductoId);
              this.creditForm.controls.zona.setValue(this.solicitudHipotecarioList.ZonaId);
              this.creditForm.controls.modalidad.setValue(this.solicitudHipotecarioList.ModalidadId);
              this.creditForm.controls.oficina.setValue(this.solicitudHipotecarioList.OficinaId);
              this.creditForm.controls.Estado.setValue(this.solicitudHipotecarioList.EstadoId);
              this.creditForm.controls.tipoDcmto.setValue(this.solicitudHipotecarioList.Tipo_DocumentoId);
              this.creditForm.controls.nroDcmto.setValue(this.solicitudHipotecarioList.N_Documento);
              this.creditForm.controls.nombreTitular.setValue(this.solicitudHipotecarioList.Nombre_Titular);
              this.creditForm.controls.riesgoMaximo.setValue(this.solicitudHipotecarioList.Riesgo_Maximo);
              this.creditForm.controls.sustentoIngresos.setValue(this.solicitudHipotecarioList.Sustento_IngresosId);
              this.creditForm.controls.Oferta.setValue(this.solicitudHipotecarioList.Oferta);
              this.descripcionDocumentos = this.solicitudHipotecarioList.Enlace_Documentos.Description;
              this.enlaceDocumentos = this.solicitudHipotecarioList.Enlace_Documentos.Url;
              this.rentaTitular = this.solicitudHipotecarioList.Tipo_RentaId;
              if (this.rentaTitular != null) {
                for (const numero of this.rentaTitular){
                  this.creditForm.get(`T${numero}`).setValue(true);
                }
              }
              this.rentaConyugue = this.solicitudHipotecarioList.Tipo_RentaConyugueId;
              if (this.rentaConyugue.length != null) {
                for (const numero of this.rentaConyugue){
                  this.creditForm.get(`C${numero}`).setValue(true);
                }
              }

              this.creditForm.controls.nombreProyecto.setValue(this.solicitudHipotecarioList.ProyectoId);
              this.creditForm.controls.numeroVivienda.setValue(this.solicitudHipotecarioList.N_ViviendaId);
              this.creditForm.controls.Moneda.setValue(this.solicitudHipotecarioList.MonedaId);
              this.creditForm.controls.TEA.setValue(this.solicitudHipotecarioList.TEA * 100);



              this.descripcionInmbueble = this.solicitudHipotecarioList.Descripcion_Inmueble;
              if (this.descripcionInmbueble !== null) {
                const cadDescripcionInmueble = this.descripcionInmbueble.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
                this.creditForm.controls.Descripcion_Inmueble.setValue(cadDescripcionInmueble);
              } else {
                this.creditForm.controls.Descripcion_Inmueble.setValue(this.descripcionInmbueble);
              }

              const Fecha_Tasacion_Remodelac = this.solicitudHipotecarioList.Fecha_Tasacion_Remodelac;
              debugger;
              this.creditForm.controls.Fecha_Tasacion_Remodelac.setValue(new Date(Fecha_Tasacion_Remodelac));
              this.creditForm.controls.Mon_Valor_ComTas_Soles.setValue(this.solicitudHipotecarioList.Mon_Valor_ComTas_Soles);
              this.creditForm.controls.Valor_ComTas_Soles.setValue(this.solicitudHipotecarioList.Valor_ComTas_Soles);
              this.creditForm.controls.Mon_VRI_Soles.setValue(this.solicitudHipotecarioList.Mon_VRI_Soles);
              this.creditForm.controls.VRI_Soles.setValue(this.solicitudHipotecarioList.VRI_Soles);

              this.creditForm.controls.Numero_Desemboslo.setValue(this.solicitudHipotecarioList.Numero_Desemboslo);
              this.creditForm.controls.Primer_desembolso.setValue(this.solicitudHipotecarioList.Primer_desembolso);
              this.creditForm.controls.Segundo_desembolso.setValue(this.solicitudHipotecarioList.Segundo_desembolso);
              this.creditForm.controls.Tercer_desembolso.setValue(this.solicitudHipotecarioList.Tercer_desembolso);
              this.creditForm.controls.Aporte_Cliente.setValue(this.solicitudHipotecarioList.Aporte_Cliente);

              this.creditForm.controls.teaAuth.setValue(this.solicitudHipotecarioList.TEA_AutorizadoId);
              this.creditForm.controls.tipoprecioVenta.setValue(this.solicitudHipotecarioList.Mon_PrecioVentaId);
              this.creditForm.controls.precioVenta.setValue(this.solicitudHipotecarioList.Precio_Venta);
              this.creditForm.controls.pFinanciamiento.setValue(this.solicitudHipotecarioList.Financiamiento * 100);
              this.creditForm.controls.Mon_Ap_Efectivo.setValue(this.solicitudHipotecarioList.Mon_Ap_EfectivoId);
              this.creditForm.controls.Aporte_Efectivo.setValue(this.solicitudHipotecarioList.Aporte_Efectivo);
              this.creditForm.controls.Mon_Aport_AFP.setValue(this.solicitudHipotecarioList.Mon_Aport_AFPId);
              this.creditForm.controls.Aporte_RetiroAFP.setValue(this.solicitudHipotecarioList.Aporte_RetiroAFP);

              this.creditForm.controls.monedaDesembolso.setValue(this.solicitudHipotecarioList.Mon_Desembolso);
              this.creditForm.controls.monedagravamen.setValue(this.solicitudHipotecarioList.Mon_Gravamen);

              this.creditForm.controls.Mon_BBP.setValue(this.solicitudHipotecarioList.Mon_BBP);
              this.creditForm.controls.BBP.setValue(this.solicitudHipotecarioList.BBP);
              this.creditForm.controls.Mon_PBB.setValue(this.solicitudHipotecarioList.Mon_PBB);
              this.creditForm.controls.PBP.setValue(this.solicitudHipotecarioList.PBP);
              this.creditForm.controls.Tipo_Moneda_Ahorro.setValue(this.solicitudHipotecarioList.Tipo_Moneda_AhorroId);
              this.creditForm.controls.Meses_Abono.setValue(this.solicitudHipotecarioList.Meses_Abono);
              this.creditForm.controls.Importe_Cuota_Ahorro.setValue(this.solicitudHipotecarioList.Importe_Cuota_Ahorro);
              this.creditForm.controls.Situacion_Plan_Ahorro.setValue(this.solicitudHipotecarioList.Situacion_Plan_AhorroId);
              this.creditForm.controls.N_Abonos_Validados.setValue(this.solicitudHipotecarioList.N_Abonos_Validados);
              this.creditForm.controls.Ultimo_Abono_Validado.setValue(this.solicitudHipotecarioList.Ultimo_Abono_ValidadoId);
              this.creditForm.controls.Cta_Ahorro_BanBif.setValue(this.solicitudHipotecarioList.Cta_Ahorro_BanBif);
              this.creditForm.controls.desembolso.setValue(this.solicitudHipotecarioList.Desembolso);
              this.creditForm.controls.gravamen.setValue(this.solicitudHipotecarioList.Grabamen);
              this.creditForm.controls.modalidadPago.setValue(this.solicitudHipotecarioList.Modalidad_PagoId);
              console.log(this.solicitudHipotecarioList.flag_PlanAhorro);
              if (this.solicitudHipotecarioList.flag_PlanAhorro === Variables.constantes.Flag_PlanAhorro1){
                this.showPlanAhorro = true;
              }else{
                this.showPlanAhorro = false;
              }

              this.planAhorro = this.solicitudHipotecarioList.Plan_Ahorro;
              if (this.planAhorro !== null) {
                const cadPlanAhorro = this.planAhorro.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
                this.creditForm.controls.Plan_Ahorro.setValue(cadPlanAhorro);

              } else {
                this.creditForm.controls.Plan_Ahorro.setValue(this.planAhorro);
              }

              this.observacionesOpcional = this.solicitudHipotecarioList.Observaciones;
              if (this.observacionesOpcional !== null) {
                const cadObservaciones = this.observacionesOpcional.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
                this.creditForm.controls.Observaciones.setValue(cadObservaciones);

              } else {
                this.creditForm.controls.Observaciones.setValue(this.observacionesOpcional);
              }

              this.condicionDesembolso = this.solicitudHipotecarioList.Condicion_Desembolso;
              if (this.condicionDesembolso !== null) {
                const cadCondicionDesembolso = this.condicionDesembolso.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
                this.creditForm.controls.Condicion_Desembolso.setValue(cadCondicionDesembolso);

              } else {
                this.creditForm.controls.Condicion_Desembolso.setValue(this.condicionDesembolso);
              }

              this.comentarioRegistro = this.solicitudHipotecarioList.Comentario_Registro;
              if (this.comentarioRegistro !== null) {
                const cadComentarioRegistro = this.comentarioRegistro.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
                this.creditForm.controls.Comentario_Registro.setValue(cadComentarioRegistro);

              } else {
                this.creditForm.controls.Comentario_Registro.setValue(this.comentarioRegistro);
              }

              this.comentarioRevisor = this.solicitudHipotecarioList.Cometario_Revisor;
              if (this.comentarioRevisor !== null) {
                const cadComentarioRevisor = this.comentarioRevisor.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
                this.creditForm.controls.Cometario_Revisor.setValue(cadComentarioRevisor);
              } else {
                this.creditForm.controls.Cometario_Revisor.setValue(this.comentarioRevisor);
              }

              this.desembolsoAmpliacion = this.solicitudHipotecarioList.Desembolso_Ampliacion;
              if (this.desembolsoAmpliacion !== null) {
                const cadDesembolsoAmpliacion = this.desembolsoAmpliacion.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
                this.creditForm.controls.Desembolso_Ampliacion.setValue(cadDesembolsoAmpliacion);
              } else {
                this.creditForm.controls.Desembolso_Ampliacion.setValue(this.desembolsoAmpliacion);
              }

              this.creditForm.controls.Observacion_CPMId.setValue(this.solicitudHipotecarioList.Observacion_CPMId);
              this.creditForm.controls.lugarVisita.setValue(this.solicitudHipotecarioList.Lugar_VisitaId);
              this.creditForm.controls.periodoGracia.setValue(this.solicitudHipotecarioList.Periodo_Gracia);
              this.creditForm.controls.tipoGarantia.setValue(this.solicitudHipotecarioList.Tipo_GarantiaId);
              this.creditForm.controls.tipoAbono.setValue(this.solicitudHipotecarioList.Tipo_AbonoId);


              console.log(this.solicitudHipotecarioList);

            })
            .catch(error => console.error(error));
        } else {

        }
      }
      );
  }
  cargarCombos(){
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
    this.getBBPAdicional();
    this.getObservacionesCPM();
    this.getEstadoGestor();
  }

  getTypeProducts(){
    this.generalListService.get(Variables.listas.AdmTipoProducto, 'Title')
    .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
    .catch(error => console.error(error));
  }

  setearMonedasSoles(){
    this.creditForm.get('Moneda').setValue(Variables.constantes.TipoMonedaSolesDatosOperacionId);
    this.creditForm.get('monedaDesembolso').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('monedagravamen').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('tipoprecioVenta').setValue(Variables.constantes.TipoMonedaSolesPrecioVentaId);
    this.creditForm.get('Mon_Ap_Efectivo').setValue(Variables.constantes.TipoMonedaSolesDatosAporteEfectivoId);
    this.creditForm.get('Mon_Aport_AFP').setValue(Variables.constantes.TipoMonedaSolesMonteAporteAFPId);
    this.creditForm.get('Mon_BBP').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_PBB').setValue(Variables.constantes.SimboloSoles);
  }
  setearMonedasEmpty(){
    this.creditForm.get('Moneda').setValue(null);
    this.creditForm.get('monedaDesembolso').setValue(null);
    this.creditForm.get('monedagravamen').setValue(null);
    this.creditForm.get('tipoprecioVenta').setValue(null);
    this.creditForm.get('Mon_Ap_Efectivo').setValue(null);
    this.creditForm.get('Mon_Aport_AFP').setValue(null);
    this.creditForm.get('Mon_BBP').setValue(null);
    this.creditForm.get('Mon_PBB').setValue(null);
  }

  setearTipoMoneda(simbolo: string, idtipo?: number){
        this.creditForm.get('Mon_BBP').setValue(simbolo);
        this.creditForm.get('Mon_PBB').setValue(simbolo);
        this.creditForm.get('monedaDesembolso').setValue(simbolo);
        this.creditForm.get('monedagravamen').setValue(simbolo);
  }

  setPlanAhorroEmpty(){
    this.creditForm.get('Meses_Abono').setValue(null);
    this.creditForm.get('Importe_Cuota_Ahorro').setValue(null);
    this.creditForm.get('Tipo_Moneda_Ahorro').setValue(null);
    this.creditForm.get('Situacion_Plan_Ahorro').setValue(null);
    this.creditForm.get('N_Abonos_Validados').setValue(null);
    this.creditForm.get('Ultimo_Abono_Validado').setValue(null);
    this.creditForm.get('Cta_Ahorro_BanBif').setValue(null);
  }
  setPlanAhorroUntouched(){
    this.creditForm.get('Meses_Abono').markAsUntouched();
    this.creditForm.get('Importe_Cuota_Ahorro').markAsUntouched();
    this.creditForm.get('Tipo_Moneda_Ahorro').markAsUntouched();
    this.creditForm.get('Situacion_Plan_Ahorro').markAsUntouched();
    this.creditForm.get('N_Abonos_Validados').markAsUntouched();
    this.creditForm.get('Ultimo_Abono_Validado').markAsUntouched();
    this.creditForm.get('Cta_Ahorro_BanBif').markAsUntouched();
  }

  setMonedaGarantia(){
    this.creditForm.get('Mon_Valor_ComTas_Soles').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_Valor_ComTas_Soles').disable();
    this.creditForm.get('Mon_VRI_Soles').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_VRI_Soles').disable();
  }

  setDisabledControlsBuenPagador(){
    this.creditForm.get('Mon_BBP').disable();
    this.creditForm.get('BBP').disable();
    this.creditForm.get('Mon_PBB').disable();
    this.creditForm.get('PBP').disable();
    this.creditForm.get('PBP_Adiconal_Sostenible').disable();
    this.creditForm.controls.Condicion_Desembolso.disable();
  }
  setDisableControlsAplicacion(){
    this.creditForm.get('Numero_Desemboslo').disable();
    this.creditForm.get('Primer_desembolso').disable();
    this.creditForm.get('Segundo_desembolso').disable();
    this.creditForm.get('Tercer_desembolso').disable();
    this.creditForm.get('Aporte_Cliente').disable();
  }

  setDisableControlsDescripcionInmueble(){
    this.creditForm.get('Descripcion_Inmueble').disable();
    this.creditForm.get('Fecha_Tasacion_Remodelac').disable();
  }
  setDisableObservacionesOpcional(){
    this.creditForm.get('Observaciones').disable();
    this.creditForm.get('lugarVisita').disable();
    this.creditForm.get('periodoGracia').disable();
  }

  setDisableComentarios(){
    this.creditForm.get('Comentario_Registro').disable();
    this.creditForm.get('Cometario_Revisor').disable();
    this.creditForm.get('Cometario_Evaluacion').disable();
  }
  setDisableControlsCabezera(){
    this.creditForm.get('typeProduct').disable();
    this.creditForm.get('ejecutivo').disable();
    this.creditForm.get('modalidad').disable();
    this.creditForm.get('subProducto').disable();
    this.creditForm.get('zona').disable();
    this.creditForm.get('oficina').disable();
    this.creditForm.get('tipoDcmto').disable();
    this.creditForm.get('nroDcmto').disable();
    this.creditForm.get('nombreTitular').disable();
    this.creditForm.get('riesgoMaximo').disable();
    this.creditForm.get('sustentoIngresos').disable();
    this.creditForm.get('Oferta').disable();
    this.creditForm.get('T1').disable();
    this.creditForm.get('T2').disable();
    this.creditForm.get('T3').disable();
    this.creditForm.get('T4').disable();
    this.creditForm.get('T5').disable();
    this.creditForm.get('T4').disable();
    this.creditForm.get('C1').disable();
    this.creditForm.get('C2').disable();
    this.creditForm.get('C3').disable();
    this.creditForm.get('C4').disable();
    this.creditForm.get('C5').disable();
  }

  setDisableControlsDatosOperacion(){
    this.creditForm.get('nombreProyecto').disable();
    this.creditForm.get('numeroVivienda').disable();
    this.creditForm.get('Moneda').disable();
    this.creditForm.get('TEA').disable();
    this.creditForm.get('teaAuth').disable();
    this.creditForm.get('tipoprecioVenta').disable();
    this.creditForm.get('precioVenta').disable();
    this.creditForm.get('pFinanciamiento').disable();
  }

  setDisableControlsDesembolso(){
    this.creditForm.get('desembolso').disable();
    this.creditForm.get('gravamen').disable();
  }
  setDisableControlsCuotaInicial(){
    this.creditForm.get('Mon_Ap_Efectivo').disable();
    this.creditForm.get('Aporte_Efectivo').disable();
    this.creditForm.get('Mon_Aport_AFP').disable();
    this.creditForm.get('Aporte_RetiroAFP').disable();
    this.creditForm.get('monedaDesembolso').disable();
    this.creditForm.get('desembolso').disable();
    this.creditForm.get('monedagravamen').disable();
    this.creditForm.get('gravamen').disable();
    this.creditForm.get('modalidadPago').disable();
  }
  setDisableControlsTipoGarantiaAbono(){
    this.creditForm.get('tipoGarantia').disable();
    this.creditForm.get('tipoAbono').disable();
  }
  setDisableControlsGarantias(){
    this.creditForm.get('Descripcion_Inmueble').disable();
    this.creditForm.get('Fecha_Tasacion_Remodelac').disable();
  }

  showInputTextObservacion(){
    this.showObservacionCPM = true;
    this.showComentarioCPM = true;
    this.showComentarioRiesgos = true;
  }

  listenerBonoBuenPagador(){
    this.creditForm.get('precioVenta').valueChanges.subscribe(selectedValue => {
        switch (true) {
          case ( selectedValue >= Variables.constantes.PrecioVenta9 && selectedValue <= Variables.constantes.PrecioVenta10):
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador5);
            break;
        case ( selectedValue >= Variables.constantes.PrecioVenta9):
            this.creditForm.get('PBP').setValue(Variables.constantes.BonoBuenPagador5);
            break;
        case ( selectedValue >= Variables.constantes.PrecioVenta7 && selectedValue <= Variables.constantes.PrecioVenta8):
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador4);
            this.creditForm.get('PBP').setValue(Variables.constantes.BonoBuenPagador6);
            break;
        case ( selectedValue >= Variables.constantes.PrecioVenta5 && selectedValue <= Variables.constantes.PrecioVenta6):
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador3);
            break;
        case ( selectedValue >= Variables.constantes.PrecioVenta3 && selectedValue <= Variables.constantes.PrecioVenta4):
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador2);
            break;
        case ( selectedValue >= Variables.constantes.PrecioVenta1 && selectedValue <= Variables.constantes.PrecioVenta2):
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador1);
            break;
        case (selectedValue <= Variables.constantes.PrecioVenta6):
            this.creditForm.get('PBP').setValue(Variables.constantes.BonoBuenPagador5);
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador5);
            break;
        default:
            this.creditForm.get('BBP').setValue('');
            this.creditForm.get('PBP').setValue('');
            break;
        }
        if (selectedValue >= Variables.constantes.PrecioVenta1 && selectedValue <= Variables.constantes.PrecioVenta10) {
          this.showmessageVivienda = false;
        } else {
          this.showmessageVivienda = true;
        }

    });

  }

  listenerPBPAdicionalSostenible(){
    this.creditForm.get('precioVenta').valueChanges.subscribe(precio => {
      this.creditForm.controls.BBP_Adicional.setValue(Variables.constantes.TipoBonoViviendaAdicionalSostenibleId);
      this.creditForm.get('BBP_Adicional').valueChanges.subscribe(idPBP => {
      if (precio <= Variables.constantes.PrecioVenta8) {
          if (idPBP !== Variables.constantes.TipoBonoViviendaAdicionalSostenibleId && precio <= Variables.constantes.PrecioVenta8){
            this.creditForm.get('PBP_Adiconal_Sostenible').setValue(Variables.constantes.BonoAdicionalViviendaSostenible);
          }else{
            this.creditForm.get('PBP_Adiconal_Sostenible').setValue(Variables.constantes.BonoBuenPagador5);
          }

      } else if (precio > Variables.constantes.PrecioVenta8 && precio < Variables.constantes.PrecioVenta10) {
        this.creditForm.get('PBP_Adiconal_Sostenible').setValue(Variables.constantes.BonoBuenPagador5);

      } else{
        this.creditForm.get('PBP_Adiconal_Sostenible').setValue(Variables.constantes.BonoBuenPagador5);
      }
    });
  });
  }
  listenerBotones(){
    this.creditForm.get('Estado').valueChanges.subscribe(estado => {
        switch (true) {
        case ( estado === Variables.constantes.EstadoCreaExpedienteId):
          this.showBtnEnviarRegularizar = false;
          this.showSaving = true;
          this.setDisabledControlsBuenPagador();
          this.creditForm.get('desembolso').disable();
          this.creditForm.get('gravamen').disable();
          break;
        case ( estado === Variables.constantes.EstadoRegistroCPM):
          this.showBtnGuardarBorrador = false;
          this.showBtnObservarRegistro = true;
          this.showBotonesProducto = false;
          this.showInputTextObservacion();
          this.setDisableControlsCabezera();
          this.setDisableControlsCuotaInicial();
          this.setDisableControlsDatosOperacion();
          this.setDisableObservacionesOpcional();
          this.creditForm.controls.Cometario_Evaluacion.disable();
          break;
        case ( estado === Variables.constantes.EstadoObservadoCPM):
          this.showBtnEnviarRegularizar = false;
          break;
        case ( estado === Variables.constantes.EstadoEvaluacionRiesgos):
          this.showBotonesProducto = false;
          this.showBtnGuardarBorrador = false;
          this.showBtnEnviar = false;
          this.showBtnAprobarSinVerificacion = true;
          this.showBtnAprobarEnVerificacion = true;
          this.showBtnObservacionOficina = true;
          this.showBtnObservacionCPM = true;
          this.showBtnRechazar = true;
          this.showComentarioRevisor = true;
          this.showInputTextObservacion();
          this.setDisableControlsCabezera();
          this.setDisableControlsDatosOperacion();
          this.setDisableControlsGarantias();
          this.setDisableObservacionesOpcional();
          this.setDisableControlsAplicacion();
          this.creditForm.controls.Comentario_Registro.disable();
          this.creditForm.controls.Cometario_Revisor.disable();
          break;
        case ( estado === Variables.constantes.EstadoVerificacionRiesgos):
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
          break;
        case( estado === Variables.constantes.EstadoAsignacionRiesgos):
          this.showBotonesProducto = false;
          this.showAsignacionRiesgos = false;
          this.showBtnGuardarBorrador = false;
          this.setDisableControlsCabezera();
          break;
        case( estado === Variables.constantes.EstadoRegularizacionCPM):
          this.showBotonesProducto = false;
          this.showBtnGuardarBorrador = false;
          this.showBtnEnviar = false;
          this.showBtnEnviarRegularizar = true;
          this.showBtnObservarRegistro = true;
          this.showComentarioRiesgos = true;
          this.creditForm.controls.Cometario_Evaluacion.disable();
          this.setDisableControlsCabezera();
          this.setDisableControlsCuotaInicial();
          this.setDisableControlsDatosOperacion();
          this.setDisableControlsTipoGarantiaAbono();
          this.setDisableObservacionesOpcional();
          break;
        case ( estado === Variables.constantes.EstadoAprobadoSinVerificacion):
          this.showComentarioRiesgos = true;
          this.showComentarioCPM = true;
          this.showComentarioRevisor = true;
          this.setDisableControlsCabezera();
          this.setDisableControlsCuotaInicial();
          this.setDisableControlsDatosOperacion();
          this.setDisableControlsTipoGarantiaAbono();
          this.setDisableObservacionesOpcional();
          this.setDisableControlsAplicacion();
          this.setDisableComentarios();
          this.showBtnObservar = false;
          this.showBtnGuardarBorrador = false;
          this.showBtnEnviar = false;
          this.showBtnGrabar = true;
          this.showBtnEnviarRegularizar = false;
          this.showControlesGestor = true;
          break;
        case ( estado !== Variables.constantes.EstadoRegistroCPM):
          this.showBtnObservar = false;
          this.showBtnEnviarRegularizar = false;
          break;

        default:
            break;
        }
    });
  }
  // listenerObservaciones(){
  //   this.creditForm.get('Estado').valueChanges.subscribe(estado => {
  //     if (estado !== Variables.constantes.EstadoObservadoCPM) {
  //       this.showObservacionCPM = false;
  //     }
  //     else{
  //       this.showObservacionCPM = true;
  //     }

  // });
  // }
  listenerTipoGarantia(){
    this.creditForm.get('tipoGarantia').valueChanges.subscribe(id => {
      if (this.typeguarenteeList !== null && this.typeguarenteeList) {
        console.log(this.typeguarenteeList);
        const garantias = this.typeguarenteeList.find(item => item.Id === id).Condiciones;
        const cadCondicionDesembolso = garantias.replace(/(<([^>]+)>|\&\w{4}|\&\#\w{3})/ig, '');
        this.creditForm.controls.Condicion_Desembolso.setValue(cadCondicionDesembolso);
      } else {
        // this.creditForm.controls.Condicion_Desembolso.setValue('');
      }

    });
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
    for (const e of this.events) {
      console.log(e);
    }
  }

  cargarListeners(){
    this.listenerTipoMoneda();
    this.listenerTipoGarantia();
    this.setMonedaGarantia();
    this.listenerBonoBuenPagador();
    this.listenerBotones();
    this.setDisabledControlsBuenPagador();
    this.listenerPBPAdicionalSostenible();
  }




  listenerTipoMoneda(){
    this.creditForm.get('Moneda').valueChanges.subscribe(selectedValue => {
      if (selectedValue === Variables.constantes.TipoMonedaDolaresDatosOperacionId) {
        this.setearTipoMoneda(Variables.constantes.SimboloDolares, Variables.constantes.TipoMonedaDolaresPrecioVentaId);
      } else {
        this.setearTipoMoneda(Variables.constantes.SimboloSoles, Variables.constantes.TipoMonedaSolesPrecioVentaId);
      }
    });
  }


  valueSubProducto(): any{
    this.creditForm.get('typeProduct').valueChanges.subscribe(selectedValue => {
      // clean array
      this.tipoSubProductoList = [];
      switch (selectedValue) {
        case Variables.constantes.TipoProductoMiViviendaId:
          this.setearMonedasSoles();
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
          this.showGarantias = true;
          this.showPVenta = false;
          this.showBotonesProducto = false;
          this.showTipoGarantiaAbono = false;
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


  valueModalidad(): any{
    this.creditForm.get('typeProduct').valueChanges.subscribe(selectedValue => {
      // clean array
      this.modalidadList = [];
      this.generalListService.getByField(Variables.listas.AdmModalidad, Variables.listas.AdmModalidadProductoId, selectedValue)
        .then((modalidadList: any) => this.modalidadList = modalidadList)
        .catch(error => console.error(error));
    });
  }






  getZonas(){
    this.generalListService.get('Zona')
    .then(zonaModelList => this.zonaModelList = zonaModelList)
    .catch(error => console.error(error));
  }


  valueOficina(): any{
    this.creditForm.get('zona').valueChanges.subscribe(selectedValue => {
      // clean array
      this.oficinaList = [];
      this.generalListService.getByField(Variables.listas.AdmOficina, Variables.listas.AdmZonaId, selectedValue)
        .then((oficinaList: any) => this.oficinaList = oficinaList)
        .catch(error => console.error(error));
    });
  }


  getTypeDocument(){
    this.generalListService.get(Variables.listas.AdmTipoDocumento)
    .then(typeDocumentList => this.typeDocumentList = typeDocumentList)
    .catch(error => console.error(error));
  }


  getSustentoIngresos(){
    this.generalListService.get(Variables.listas.AdmSustentoIngresos)
    .then(sustIngresosList => this.sustIngresosList = sustIngresosList)
    .catch(error => console.error(error));
  }

  getProject(){
    // TODO, implement search
    this.generalListService.get(Variables.listas.AdmProyectos, Variables.columns.Title)
    .then(projectList => {
      this.projectList = projectList;
      console.log({
        projectList,
        projectList2: this.projectList
      });
    })
    .catch(error => console.error(error));
  }

  getNVivienda(){
    this.generalListService.get(Variables.listas.AdmNumeroVivienda)
    .then(nviviendaList => this.nviviendaList = nviviendaList)
    .catch(error => console.error(error));
  }

  getCurrencyAporteEfectivo(){
    this.generalListService.get(Variables.listas.AdmTipoMonedaAporteEfectivo)
    .then(currencyAporteEfectivoList => this.currencyAporteEfectivoList = currencyAporteEfectivoList)
    .catch(error => console.error(error));
  }

  getCurrencyAporteAFP(){
    this.generalListService.get(Variables.listas.AdmTipoMonedaAporteAFP)
    .then(currencyAporteAFPList => this.currencyAporteAFPList = currencyAporteAFPList)
    .catch(error => console.error(error));
  }

  getCurrency(){
    this.generalListService.get(Variables.listas.AdmMoneda)
    .then(currencyList => this.currencyList = currencyList)
    .catch(error => console.error(error));
  }

  getTEA(){
    this.generalListService.get(Variables.listas.AdmTEAAutorizada)
    .then(TEAList => this.TEAList = TEAList)
    .catch(error => console.error(error));
  }

  getTypeCurrencyPriceSale(){
    this.generalListService.get(Variables.listas.AdmTipoMonedaPrecioVenta)
    .then(typeCurrencyList => this.typeCurrencyList = typeCurrencyList)
    .catch(error => console.error(error));
  }

  getPaymentMethod(){
    this.generalListService.get(Variables.listas.AdmModalidadPago)
    .then(paymentMethodList => this.paymentMethodList = paymentMethodList)
    .catch(error => console.error(error));
  }

  getVisitingPlace(){
    this.generalListService.get(Variables.listas.AdmLugarVisita)
    .then(visitingPlaceList => this.visitingPlaceList = visitingPlaceList)
    .catch(error => console.error(error));
  }
  getEstadoGestor(){
    this.generalListService.get(Variables.listas.AdmEstadoGestor)
    .then(estadoGestorList => this.estadoGestorList = estadoGestorList)
    .catch(error => console.error(error));
  }

  getvalueGarantias(): any{
    this.creditForm.get('modalidad').valueChanges.subscribe(selectedValue => {
      // clean array
      //this.typeguarenteeList = ;
      this.generalListService.getByField(Variables.listas.AdmTipoGarantia, Variables.listas.AdmModalidad, selectedValue)
        .then((typeguarenteeList: any) => this.typeguarenteeList = typeguarenteeList)
        .catch(error => console.error(error));
    });
  }


  getPaymentType(){
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
  }

  getTypeCurrencySaving(){
    this.generalListService.get(Variables.listas.AdmTipoMonedaAhorro)
    .then(typeCurrencySaving => this.typeCurrencySaving = typeCurrencySaving)
    .catch(error => console.error(error));
  }

  getPlanSituationSaving(){
    this.generalListService.get(Variables.listas.AdmSituacionPlanAhorro)
    .then(planSituationSavingList => this.planSituationSavingList = planSituationSavingList)
    .catch(error => console.error(error));
  }

  getLastValidatedBono(){
    this.generalListService.get(Variables.listas.AdmUltimoAbonoValidado)
    .then(LastValidatedBonoList => this.LastValidatedBonoList = LastValidatedBonoList)
    .catch(error => console.error(error));
  }

  getBBPAdicional(){
    this.generalListService.get(Variables.listas.AdmBBPAdicional)
    .then(BBPAdicionalList => this.BBPAdicionalList = BBPAdicionalList)
    .catch(error => console.error(error));
  }

  getEstado(){
    this.generalListService.get(Variables.listas.AdmEstado)
    .then(estadoList =>  this.estadoList = estadoList)
    .catch(error => console.error(error));
  }

  getObjectToSave(): any {
    if (this.creditForm.controls.Meses_Abono !== null ||
      this.creditForm.controls.Tipo_Moneda_Ahorro.value !== null ||
      this.creditForm.controls.Importe_Cuota_Ahorro.value !== null ||
      this.creditForm.controls.Situacion_Plan_Ahorro.value !== null ||
      this.creditForm.controls.N_Abonos_Validados.value !== null ||
      this.creditForm.controls.Ultimo_Abono_Validado.value !== null ||
      this.creditForm.controls.Cta_Ahorro_BanBif.value
    ) {
      this.flagPlanAhorro = Variables.constantes.Flag_PlanAhorro1;

    } else {
      this.flagPlanAhorro = Variables.constantes.Flag_PlanAhorro0;
    }
    const rentaTitular = [];
    const rentaConyugue = [];
    for (let index = 1; index <= 5; index++) {
      this.creditForm.get(`T${index}`).value && (rentaTitular.push(index)) && (rentaConyugue.push(index));
    }

    const ejecutivo = this.getValorControlPeoplePicker('ejecutivo', this.creditForm);

    const Fecha_Tasacion_Remodelac = this.creditForm.controls.Fecha_Tasacion_Remodelac.value;
    debugger;

    const solicitudCreditoHipotecario = {
      EjecutivoId: ejecutivo,
      Tipo_ProductoId: this.creditForm.controls.typeProduct.value,
      Sub_ProductoId: this.creditForm.controls.subProducto.value,
      ModalidadId: this.creditForm.controls.modalidad.value,
      ZonaId: this.creditForm.controls.zona.value,
      OficinaId: this.creditForm.controls.oficina.value,
      EstadoId: Variables.constantes.EstadoCreaExpedienteId,
      Nombre_Titular: this.creditForm.controls.nombreTitular.value,
      Tipo_DocumentoId: this.creditForm.controls.tipoDcmto.value,
      N_Documento: `${this.creditForm.controls.nroDcmto.value}`,

      Riesgo_Maximo: +this.creditForm.controls.riesgoMaximo.value,
      Sustento_IngresosId: this.creditForm.controls.sustentoIngresos.value,
      Oferta: this.creditForm.controls.Oferta.value,
      Tipo_RentaId: {results: rentaTitular},
      Tipo_RentaConyugueId: {results: rentaConyugue},
      ProyectoId: this.creditForm.controls.nombreProyecto.value,
      N_ViviendaId: this.creditForm.controls.numeroVivienda.value,
      MonedaId: this.creditForm.controls.Moneda.value,
      TEA: ((+this.creditForm.controls.TEA.value) / 100),
      TEA_AutorizadoId: this.creditForm.controls.teaAuth.value,
      Mon_PrecioVentaId: this.creditForm.controls.tipoprecioVenta.value,
      Precio_Venta: +this.creditForm.controls.precioVenta.value,
      Financiamiento: ((+this.creditForm.controls.pFinanciamiento.value) / 100),
      Mon_Ap_EfectivoId: this.creditForm.controls.Mon_Ap_Efectivo.value,
      Aporte_Efectivo: +this.creditForm.controls.Aporte_Efectivo.value,
      Mon_Aport_AFPId: this.creditForm.controls.Mon_Aport_AFP.value,
      Aporte_RetiroAFP: +this.creditForm.controls.Aporte_RetiroAFP.value,
      Mon_BBP: this.creditForm.controls.Mon_BBP.value,
      BBP: this.creditForm.controls.BBP.value,
      Mon_PBB: this.creditForm.controls.Mon_PBB.value,
      PBP: +this.creditForm.controls.PBP.value,
      Mon_Desembolso: this.creditForm.controls.monedaDesembolso.value,
      Desembolso: this.creditForm.controls.desembolso.value,
      Mon_Gravamen: this.creditForm.controls.monedagravamen.value,
      Grabamen: +this.creditForm.controls.gravamen.value,
      Modalidad_PagoId: this.creditForm.controls.modalidadPago.value,
      Observaciones: this.creditForm.controls.Observaciones.value,
      Lugar_VisitaId: this.creditForm.controls.lugarVisita.value,
      Periodo_Gracia: +this.creditForm.controls.periodoGracia.value,
      Tipo_GarantiaId: this.creditForm.controls.tipoGarantia.value,
      Tipo_AbonoId: this.creditForm.controls.tipoAbono.value,
      Condicion_Desembolso: this.creditForm.controls.Condicion_Desembolso.value,
      Desembolso_Ampliacion: this.creditForm.controls.Desembolso_Ampliacion.value,
      Numero_Desemboslo: this.creditForm.controls.Numero_Desemboslo.value,
      Primer_desembolso: this.creditForm.controls.Primer_desembolso.value,
      Segundo_desembolso: this.creditForm.controls.Segundo_desembolso.value,
      Tercer_desembolso: this.creditForm.controls.Tercer_desembolso.value,
      Aporte_Cliente: this.creditForm.controls.Aporte_Cliente.value,
      Descripcion_Inmueble: this.creditForm.controls.Descripcion_Inmueble.value,
      Fecha_Tasacion_Remodelac,
      Valor_ComTas_Soles: this.creditForm.controls.Valor_ComTas_Soles.value,
      VRI_Soles: this.creditForm.controls.VRI_Soles.value,

      Meses_Abono: this.creditForm.controls.Meses_Abono.value,
      Tipo_Moneda_AhorroId: this.creditForm.controls.Tipo_Moneda_Ahorro.value,
      Importe_Cuota_Ahorro: this.creditForm.controls.Importe_Cuota_Ahorro.value,
      Situacion_Plan_AhorroId: this.creditForm.controls.Situacion_Plan_Ahorro.value,
      N_Abonos_Validados: this.creditForm.controls.N_Abonos_Validados.value,
      Ultimo_Abono_ValidadoId: this.creditForm.controls.Ultimo_Abono_Validado.value,
      Plan_Ahorro: this.creditForm.controls.Plan_Ahorro.value,
      Cta_Ahorro_BanBif: this.creditForm.controls.Cta_Ahorro_BanBif.value,
      flag_PlanAhorro: this.flagPlanAhorro
    };

    return solicitudCreditoHipotecario;
  }

  saveDraft(): void{

    const solicitudCreditoHipotecario = this.getObjectToSave();

    this.route.params.subscribe(param => {
      if (param.id) {

        this.solicitudService.save(param.id, solicitudCreditoHipotecario)
          .then(resp => {
            console.log(resp);
            if (resp) {
              Swal.fire(
                'Datos guardados correctamente!',
                '',
                'success'
              );
              this.router.navigate(['/bandejas/solicitudes']);
            }
          })
          .catch(error => console.log(error));
      } else {
        this.solicitudService.save(0, solicitudCreditoHipotecario)
          .then(resp => {
            console.log(resp);
            if (resp) {
              Swal.fire(
                'Datos guardados correctamente!',
                '',
                'success'
              );
              this.router.navigate(['/bandejas/solicitudes']);
            }
          })
          .catch(error => console.log(error));
      }

    });

  }

  getObservacionesCPM(){
    this.generalListService.get(Variables.listas.AdmObservacionesCPM)
    .then(observacionesCPMList =>  this.observacionesCPMList = observacionesCPMList)
    .catch(error => console.error(error));
  }

  calculaDesembolso(){
    const precioVenta = this.creditForm.get('precioVenta').value;
    const AporteEfectivo = this.creditForm.get('Aporte_Efectivo').value;
    const AporteRetiroAFP = this.creditForm.get('Aporte_RetiroAFP').value;
    const BBP = this.creditForm.get('BBP').value;
    const PBP = this.creditForm.get('PBP').value;
    const PBPAdicionalSostenible = this.creditForm.get('PBP_Adiconal_Sostenible').value;
    const desembolso = precioVenta - AporteEfectivo - AporteRetiroAFP - BBP  - PBP - PBPAdicionalSostenible;
    this.desembolso = desembolso;
    this.creditForm.get('desembolso').setValue(desembolso);

  }

  calculaGravamen(){
    const BBP = this.creditForm.get('BBP').value;
    const PBP = this.creditForm.get('PBP').value;
    const PBPAdicionalSostenible = this.creditForm.get('PBP_Adiconal_Sostenible').value;
    const gravamen = (this.desembolso + BBP  + PBP + PBPAdicionalSostenible) * 120 / 100;
    this.creditForm.get('gravamen').setValue(gravamen);
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

  send() {
    const EstadoIdOld = this.creditForm.controls.Estado.value;
    // let Fecha_Registro_CPM: Date;
    let EstadoId = 0;
    [0, Variables.constantes.EstadoCreaExpedienteId].includes(EstadoIdOld) && (EstadoId = Variables.constantes.EstadoRegistroCPM)/* && (Fecha_Registro_CPM = new Date())*/;
    EstadoIdOld === Variables.constantes.EstadoRegistroCPM && (EstadoId = Variables.constantes.EstadoAsignacionRiesgos);
    EstadoIdOld === Variables.constantes.EstadoAsignacionRiesgos && (EstadoId = Variables.constantes.EstadoEvaluacionRiesgos);

    const itemSave = this.getObjectToSave();
    itemSave.EstadoId = EstadoId;
    itemSave.Fecha_Estado = new Date();

    // Fecha_Registro_CPM && (itemSave.Fecha_Registro_CPM = Fecha_Registro_CPM);

    this.update(itemSave);
  }

  observationReview(): void {
    const itemSave = {
      EstadoId: 31 // TODO, create constant
    };

    this.update(itemSave);
  }

  approve(): void {
    const itemSave = {
      EstadoId: 34, // TODO, create constant
      Fecha_Aprob_Verifica: new Date()
    };

    this.update(itemSave);
  }

  approveWithoutVerification(): void {
    const itemSave = {
      EstadoId: 33, // TODO, create constant
      Fecha_AprobSVerifica: new Date()
    };

    this.update(itemSave);
  }

  inVerification(): void {
    const itemSave = {
      EstadoId: 32, // TODO, create constant
      Fecha_Estado: new Date(),
      Fecha_Verific_Riesgos: new Date(),
    };

    this.update(itemSave);
  }

  officeObservation(): void {
    const itemSave = {
      EstadoId: 5, // TODO, create constant
      Fecha_Estado: new Date(),
      Fecha_Observ_Riesgos: new Date(),
    };

    this.update(itemSave);
  }

  cpmObservation(): void {
    const itemSave = {
      EstadoId: 37, // TODO, create constant
      Fecha_Estado: new Date()
    };

    this.update(itemSave);
  }

  rejected(): void {
    const itemSave = {
      EstadoId: 6, // TODO, create constant
      Fecha_Rechaz_Riesgos: new Date()
    };

    this.update(itemSave);
  }

  update(itemSave: any): void {
    this.solicitudService.save(this.solicitudHipotecarioList.Id, itemSave)
    .then(resp => {
      console.log(resp);
      if (resp) {
        Swal.fire(
          'Datos guardados correctamente!',
          '',
          'success'
        );

        this.router.navigate(['/bandejas/solicitudes']);
      }
    })
    .catch(error => console.log(error)); // TODO, define some message error
  }

  cancel(): void {

  }
}
