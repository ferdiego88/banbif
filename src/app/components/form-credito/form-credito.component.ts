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
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormularioBase } from '../../shared/pages/formularioBase';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerVisibilityService } from 'ng-http-loader';
import Swal from 'sweetalert2';

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
  garantiasList: TipoProductoModel[];
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
  showAnalistaRiesgos = false;
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
    ejecutivo: [null, Validators.required],
    Analista_Riesgos: [null, Validators.required],
    Sub_ProductoId: [null, Validators.required],
    ZonaId: [null, Validators.required],
    ModalidadId: [null, Validators.required],
    OficinaId: [null, Validators.required],
    EstadoId: [0, Validators.required],
    Tipo_DocumentoId: [null, Validators.required],
    N_Documento: [null, [Validators.required, Validators.maxLength(11)]],
    Nombre_Titular: [null, Validators.required],
    Riesgo_Maximo: [null, Validators.required],
    Sustento_IngresosId: [null, Validators.required],
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
    ProyectoId: [null, Validators.required],
    N_ViviendaId: [null, Validators.required],
    tipoMoneda: [null, Validators.required],
    MonedaId: [null, Validators.required],
    TEA: [null, Validators.required],
    TEA_AutorizadoId: [null, Validators.required],
    Mon_PrecioVentaId: [null, Validators.required],
    Precio_Venta: [null, Validators.required],
    pFinanciamiento: [null, Validators.required],
    Mon_Desembolso: [null, Validators.required],
    Desembolso: [null, Validators.required],
    Mon_Gravamen: [null, Validators.required],
    Mon_BBP: [null, Validators.required],
    Mon_PBB: [null, Validators.required],
    BBP: [null, Validators.required],
    PBP: [null, Validators.required],
    Grabamen: [null, Validators.required],
    Modalidad_PagoId: [null, Validators.required],
    Lugar_VisitaId: [null, Validators.required],
    Periodo_Gracia: [null, Validators.required],
    Tipo_GarantiaId: [null, Validators.required],
    Tipo_AbonoId: [null, Validators.required],
    /* Plan Ahorro*/
    Meses_Abono: [null, Validators.required],
    Tipo_Moneda_AhorroId: [null, Validators.required],
    Importe_Cuota_Ahorro: [null, Validators.required],
    Situacion_Plan_AhorroId: [null, Validators.required],
    N_Abonos_Validados: [null, Validators.required],
    Ultimo_Abono_ValidadoId: [null, Validators.required],
    Cta_Ahorro_BanBif: [null, Validators.required],
    Plan_Ahorro: [null, Validators.required],
    /*Fin Plan Ahorro */

    /* Cuota Inicial*/
    Mon_Ap_Efectivo: [null, Validators.required],
    Aporte_Efectivo: [null, Validators.required],
    Mon_Aport_AFPId: [null, Validators.required],
    Aporte_RetiroAFP: [null, Validators.required],
    BBP_Adicional: [null, Validators.required],
    PBP_Adiconal_Sostenible: [null, Validators.required],
    /* Fin Cuota Inicial*/

    /* Ini Garantias*/
    Descripcion_Inmueble: [null, Validators.required],
    Fecha_Tasacion_Remodelac: [new Date(), Validators.required],
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
    Observacion_CPMId: [null, ],
    Observacion_CPM: [null, ],
    Comentario_Registro: [null, Validators.required],
    Cometario_Revisor: [null, Validators.required],
    Cometario_Revisor1: [null, Validators.required],
    Cometario_Evaluacion: [null, Validators.required],
    Condicion_Desembolso: [null, Validators.required],
    Condicion_Desembolso1: [null, Validators.required],
    Desembolso_Ampliacion: [null, Validators.required],
    Enlace_Documentos: [null, Validators.required],
    Anlista_RiesgosId: [null, Validators.required],
    EstadoGestorId: [null, Validators.required],
    Fecha_Gestor_Hip: [new Date(), Validators.required],
    Comentario_Gestor_Hip: [null, Validators.required],

    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;
  comentarios = [
  Variables.columnasSolicitud.Descripcion_Inmueble, Variables.columnasSolicitud.Plan_Ahorro, Variables.columnasSolicitud.Observaciones,
  Variables.columnasSolicitud.Condicion_Desembolso, Variables.columnasSolicitud.Comentario_Registro,
  Variables.columnasSolicitud.Desembolso_Ampliacion, Variables.columnasSolicitud.Cometario_Evaluacion,
  Variables.columnasSolicitud.Comentario_Gestor_Hip ];

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
    public spinner: SpinnerVisibilityService
  ) {
    super('Solicitud de Crédito Hipotecario', applicationRef, dialog, route, router, masterService, zone, spinner);
  }

  ngOnInit() {
   this.cargarCombos();
   this.getidParams();
   this.cargarListeners();
   this.creditForm.get('EstadoId').disable();
   this.setDisableControlsDesembolso();
  }

  getidParams(){
    this.route.params.subscribe(
      param => {
        if (param.id) {
          this.solicitudService.getItemById(param.id)
            .then(solicitudHipotecarioList => {
              console.log({solicitudHipotecarioList});
              this.solicitudHipotecarioList = solicitudHipotecarioList[0];

              if (solicitudHipotecarioList[0].EjecutivoId) {
                  const ejecutivo = {
                    Id: solicitudHipotecarioList[0].Ejecutivo.Id,
                    Title: solicitudHipotecarioList[0].Ejecutivo.Title
                  };
                  this.creditForm.controls.ejecutivo.setValue([ejecutivo]);
               }

              if (solicitudHipotecarioList[0].Anlista_RiesgosId) {
                  const analista = {
                    Id: solicitudHipotecarioList[0].Anlista_Riesgos.Id,
                    Title: solicitudHipotecarioList[0].Anlista_Riesgos.Title
                  };
                  this.creditForm.controls.Analista_Riesgos.setValue([analista]);
               }

              for (const i of this.comentarios) {
                const controlForm = this.solicitudHipotecarioList[i];
                if (controlForm !== null) {
                  const cadControlForm = controlForm.replace(this.expRegular, '');
                  this.creditForm.controls[i].setValue(cadControlForm);
                }
               }

              for (const key in Variables.columnasHipo) {
                 if (Object.prototype.hasOwnProperty.call(Variables.columnasHipo, key)) {
                   const element = Variables.columnasHipo[key];
                   this.creditForm.controls[element].setValue(this.solicitudHipotecarioList[element]);
                 }
               }
              this.creditForm.controls.TEA.setValue(this.solicitudHipotecarioList.TEA * 100);
              this.creditForm.controls.pFinanciamiento.setValue(this.solicitudHipotecarioList.Financiamiento * 100);
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
              const Fecha_Tasacion_Remodelac = this.solicitudHipotecarioList.Fecha_Tasacion_Remodelac;
              const Fecha_Gestor_Hip = this.solicitudHipotecarioList.Fecha_Gestor_Hip;
              // debugger;
              this.creditForm.controls.Fecha_Tasacion_Remodelac.setValue(new Date(Fecha_Tasacion_Remodelac));
              if (Fecha_Gestor_Hip) {
                this.creditForm.controls.Fecha_Gestor_Hip.setValue(new Date(Fecha_Gestor_Hip));
              } else {
                this.creditForm.controls.Fecha_Gestor_Hip.setValue(new Date());
              }
              if (this.solicitudHipotecarioList.flag_PlanAhorro === Variables.constantes.Flag_PlanAhorro1
                && this.solicitudHipotecarioList.EstadoId !== Variables.constantes.EstadoAsignacionRiesgos){
                this.showPlanAhorro = true;
              }else{
                this.showPlanAhorro = false;
              }
              this.comentarioRevisor = this.solicitudHipotecarioList.Cometario_Revisor;
              if (this.comentarioRevisor !== null) {
                const cadComentarioRevisor = this.comentarioRevisor.replace(this.expRegular, '');
                this.creditForm.controls.Cometario_Revisor.setValue(cadComentarioRevisor);
                this.creditForm.controls.Cometario_Revisor1.setValue(cadComentarioRevisor);
              }
              this.solicitudHipotecarioList.Enlace_Documentos && this.solicitudHipotecarioList.Enlace_Documentos !== null && (this.descripcionDocumentos = this.solicitudHipotecarioList.Enlace_Documentos.Description);
              this.enlaceDocumentos = this.solicitudHipotecarioList.Enlace_Documentos.Url;
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
    this.creditForm.get('MonedaId').setValue(Variables.constantes.TipoMonedaSolesDatosOperacionId);
    this.creditForm.get('Mon_Desembolso').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_Gravamen').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_PrecioVentaId').setValue(Variables.constantes.TipoMonedaSolesPrecioVentaId);
    this.creditForm.get('Mon_Ap_Efectivo').setValue(Variables.constantes.TipoMonedaSolesDatosAporteEfectivoId);
    this.creditForm.get('Mon_Aport_AFPId').setValue(Variables.constantes.TipoMonedaSolesMonteAporteAFPId);
    this.creditForm.get('Mon_BBP').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_PBB').setValue(Variables.constantes.SimboloSoles);
  }
  setearMonedasEmpty(){
    this.creditForm.get('MonedaId').setValue(null);
    this.creditForm.get('Mon_Desembolso').setValue(null);
    this.creditForm.get('Mon_Gravamen').setValue(null);
    this.creditForm.get('Mon_PrecioVentaId').setValue(null);
    this.creditForm.get('Mon_Ap_Efectivo').setValue(null);
    this.creditForm.get('Mon_Aport_AFPId').setValue(null);
    this.creditForm.get('Mon_BBP').setValue(null);
    this.creditForm.get('Mon_PBB').setValue(null);
  }

  setearTipoMoneda(simbolo: string, idtipo?: number){
        this.creditForm.get('Mon_BBP').setValue(simbolo);
        this.creditForm.get('Mon_PBB').setValue(simbolo);
        this.creditForm.get('Mon_Desembolso').setValue(simbolo);
        this.creditForm.get('Mon_Gravamen').setValue(simbolo);
  }

  setPlanAhorroEmpty(){
    this.creditForm.get('Meses_Abono').setValue(null);
    this.creditForm.get('Importe_Cuota_Ahorro').setValue(null);
    this.creditForm.get('Tipo_Moneda_AhorroId').setValue(null);
    this.creditForm.get('Situacion_Plan_AhorroId').setValue(null);
    this.creditForm.get('N_Abonos_Validados').setValue(null);
    this.creditForm.get('Ultimo_Abono_ValidadoId').setValue(null);
    this.creditForm.get('Cta_Ahorro_BanBif').setValue(null);
  }
  setPlanAhorroUntouched(){
    this.creditForm.get('Meses_Abono').markAsUntouched();
    this.creditForm.get('Importe_Cuota_Ahorro').markAsUntouched();
    this.creditForm.get('Tipo_Moneda_AhorroId').markAsUntouched();
    this.creditForm.get('Situacion_Plan_AhorroId').markAsUntouched();
    this.creditForm.get('N_Abonos_Validados').markAsUntouched();
    this.creditForm.get('Ultimo_Abono_ValidadoId').markAsUntouched();
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
  setDisableControlsPlanAhorroProgramado(){
    this.creditForm.get('Meses_Abono').disable();
    this.creditForm.get('Tipo_Moneda_AhorroId').disable();
    this.creditForm.get('Importe_Cuota_Ahorro').disable();
    this.creditForm.get('Situacion_Plan_AhorroId').disable();
    this.creditForm.get('N_Abonos_Validados').disable();
    this.creditForm.get('Ultimo_Abono_ValidadoId').disable();
    this.creditForm.get('Cta_Ahorro_BanBif').disable();
    this.creditForm.get('Plan_Ahorro').disable();
  }

  setDisableControlsDescripcionInmueble(){
    this.creditForm.get('Descripcion_Inmueble').disable();
    this.creditForm.get('Fecha_Tasacion_Remodelac').disable();
  }
  setDisableObservacionesOpcional(){
    this.creditForm.get('Observaciones').disable();
    this.creditForm.get('Lugar_VisitaId').disable();
    this.creditForm.get('Periodo_Gracia').disable();
  }

  setDisableComentarios(){
    this.creditForm.get('Comentario_Registro').disable();
    this.creditForm.get('Cometario_Revisor').disable();
    this.creditForm.get('Cometario_Evaluacion').disable();
  }
  setDisableControlsCabezera(){
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

  setDisableControlsDatosOperacion(){
    this.creditForm.get('ProyectoId').disable();
    this.creditForm.get('N_ViviendaId').disable();
    this.creditForm.get('MonedaId').disable();
    this.creditForm.get('TEA').disable();
    this.creditForm.get('TEA_AutorizadoId').disable();
    this.creditForm.get('Mon_PrecioVentaId').disable();
    this.creditForm.get('Precio_Venta').disable();
    this.creditForm.get('pFinanciamiento').disable();
  }

  setDisableControlsDesembolso(){
    this.creditForm.get('Desembolso').disable();
    this.creditForm.get('Grabamen').disable();
  }
  setDisableControlsCuotaInicial(){
    this.creditForm.get('Mon_Ap_Efectivo').disable();
    this.creditForm.get('Aporte_Efectivo').disable();
    this.creditForm.get('Mon_Aport_AFPId').disable();
    this.creditForm.get('Aporte_RetiroAFP').disable();
    this.creditForm.get('Mon_Desembolso').disable();
    this.creditForm.get('Desembolso').disable();
    this.creditForm.get('Mon_Gravamen').disable();
    this.creditForm.get('Grabamen').disable();
    this.creditForm.get('Modalidad_PagoId').disable();
  }
  setDisableControlsTipoGarantiaAbono(){
    this.creditForm.get('Tipo_GarantiaId').disable();
    this.creditForm.get('Tipo_AbonoId').disable();
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
  showInputObservacion(){
    this.showObservacionCPM = false;
    this.showComentarioCPM = true;
    this.showComentarioRiesgos = true;
    this.creditForm.controls.Cometario_Revisor1.disable();
  }

  listenerBonoBuenPagador(){
    this.creditForm.get('Precio_Venta').valueChanges.subscribe(selectedValue => {
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
    this.creditForm.get('Precio_Venta').valueChanges.subscribe(precio => {
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
    this.creditForm.get('EstadoId').valueChanges.subscribe(estado => {
        switch (true) {
        case ( estado === Variables.constantes.EstadoCreaExpedienteId):
          this.showBtnEnviarRegularizar = false;
          this.showSaving = true;
          this.setDisabledControlsBuenPagador();
          this.creditForm.get('Desembolso').disable();
          this.creditForm.get('Grabamen').disable();
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
          this.showAnalistaRiesgos = true;
          this.showInputObservacion();
          this.setDisableControlsCabezera();
          this.setDisableControlsGarantias();
          this.setDisableObservacionesOpcional();
          this.setDisableControlsAplicacion();
          this.setDisableControlsPlanAhorroProgramado();
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
          this.setDisableControlsPlanAhorroProgramado();
          break;
        case( estado === Variables.constantes.EstadoAsignacionRiesgos):
          this.showBotonesProducto = false;
          this.showAsignacionRiesgos = false;
          this.showBtnGuardarBorrador = false;
          this.showPlanAhorro = false;
          this.setDisableControlsCabezera();
          this.setDisableControlsPlanAhorroProgramado();
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
          this.setDisableControlsPlanAhorroProgramado();
          break;
        case ( estado === Variables.constantes.EstadoAprobadoSinVerificacion):
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
          break;
        case ( estado === Variables.constantes.EstadoRechazado):
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
  //   this.creditForm.get('EstadoId').valueChanges.subscribe(estado => {
  //     if (estado !== Variables.constantes.EstadoObservadoCPM) {
  //       this.showObservacionCPM = false;
  //     }
  //     else{
  //       this.showObservacionCPM = true;
  //     }

  // });
  // }
  listenerTipoGarantia(){
    this.creditForm.get('Tipo_GarantiaId').valueChanges.subscribe(id => {
      if (this.typeguarenteeList !== null && this.typeguarenteeList) {

        const garantias = this.typeguarenteeList.find(item => item.Id === id).Condiciones;
        const cadCondicionDesembolso = garantias.replace(this.expRegular, '');
        this.creditForm.controls.Condicion_Desembolso.setValue(cadCondicionDesembolso);
      } else {
        // this.creditForm.controls.Condicion_Desembolso.setValue('');
      }

    });
  }
  // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.events.push(`${type}: ${event.value}`);
  //   for (const e of this.events) {
  //     console.log(e);
  //   }
  // }

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
    this.creditForm.get('MonedaId').valueChanges.subscribe(selectedValue => {
      if (selectedValue === Variables.constantes.TipoMonedaDolaresDatosOperacionId) {
        this.setearTipoMoneda(Variables.constantes.SimboloDolares, Variables.constantes.TipoMonedaDolaresPrecioVentaId);
      } else {
        this.setearTipoMoneda(Variables.constantes.SimboloSoles, Variables.constantes.TipoMonedaSolesPrecioVentaId);
      }
    });
  }


  valueSubProducto(): any{
    this.creditForm.get('Tipo_ProductoId').valueChanges.subscribe(selectedValue => {
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
          this.creditForm.controls.Condicion_Desembolso.setValue('');
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
          this.creditForm.controls.Condicion_Desembolso.setValue('');
          break;
        case Variables.constantes.TipoProductoAmpliacionRemodelacionConstruccionId:
          this.creditForm.controls.Condicion_Desembolso.setValue( `    ${Variables.condicionesDesembolso.ContratoFirma}
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
          this.creditForm.controls.Condicion_Desembolso.setValue('');
          this.setearMonedasEmpty();
          break;

        default:
          this.showGarantias = false;
          this.showPVenta = true;
          this.showBotonesProducto = true;
          this.showmessageVivienda = false;
          this.showBuenAplicacion = false;
          this.setearMonedasEmpty();
          this.creditForm.controls.Condicion_Desembolso.setValue('');
          break;
      }
      this.generalListService.getByField(Variables.listas.AdmTipoSubProducto, Variables.listas.AdmTipoProductoId, selectedValue)
        .then((tipoSubProductoList: any) => this.tipoSubProductoList = tipoSubProductoList)
        .catch(error => console.error(error));
    });
  }


  valueModalidad(): any{
    this.creditForm.get('Tipo_ProductoId').valueChanges.subscribe(selectedValue => {
      // clean array
      this.modalidadList = [];
      this.generalListService.getByField(Variables.listas.AdmModalidad, Variables.listas.AdmModalidadProductoId, selectedValue)
        .then((modalidadList: any) => this.modalidadList = modalidadList)
        .catch(error => console.error(error));
    });
  }

  getZonas(){
    this.generalListService.get(Variables.listas.AdmZona)
    .then(zonaModelList => this.zonaModelList = zonaModelList)
    .catch(error => console.error(error));
  }


  valueOficina(): any{
    this.creditForm.get('ZonaId').valueChanges.subscribe(selectedValue => {
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
    this.creditForm.get('ModalidadId').valueChanges.subscribe(selectedValue => {
      // clean array
      //this.typeguarenteeList = ;
      this.generalListService.getByField(Variables.listas.AdmTipoGarantia, Variables.listas.AdmModalidad, selectedValue)
        .then((typeguarenteeList: any) => this.typeguarenteeList = typeguarenteeList)
        .catch(error => console.error(error));
    });
  }

  // getGarantiasAll(){
  //   this.generalListService.get(Variables.listas.AdmTipoGarantia)
  //   .then(garantiasList => this.garantiasList = garantiasList)
  //   .catch(error => console.error(error));
  // }



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
    if (this.creditForm.controls.Meses_Abono.value !== null ||
      this.creditForm.controls.Tipo_Moneda_AhorroId.value !== null ||
      this.creditForm.controls.Importe_Cuota_Ahorro.value !== null ||
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

    const ejecutivo = this.getValorControlPeoplePicker('ejecutivo', this.creditForm);
    const analistaRiesgo = this.getValorControlPeoplePicker('Analista_Riesgos', this.creditForm);

    const Fecha_Tasacion_Remodelac = this.creditForm.controls.Fecha_Tasacion_Remodelac.value;
    const Fecha_Gestor_Hip = this.creditForm.controls.Fecha_Gestor_Hip.value;

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
      BBP: this.creditForm.controls.BBP.value,
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

      Precio_Venta: +this.creditForm.controls.Precio_Venta.value,
      Aporte_Efectivo: +this.creditForm.controls.Aporte_Efectivo.value,
       Aporte_RetiroAFP: +this.creditForm.controls.Aporte_RetiroAFP.value,
      Riesgo_Maximo: +this.creditForm.controls.Riesgo_Maximo.value,
      Tipo_RentaConyugueId: {results: rentaConyugue},
      Anlista_RiesgosId: analistaRiesgo,
      N_Documento: `${this.creditForm.controls.N_Documento.value}`,
      Tipo_RentaId: {results: rentaTitular},
      PBP: +this.creditForm.controls.PBP.value,
      Grabamen: +this.creditForm.controls.Grabamen.value,
      Periodo_Gracia: +this.creditForm.controls.Periodo_Gracia.value,
      TEA: ((+this.creditForm.controls.TEA.value) / 100),
      Financiamiento: ((+this.creditForm.controls.pFinanciamiento.value) / 100),
      Fecha_Tasacion_Remodelac,
      Fecha_Gestor_Hip,
      flag_PlanAhorro: this.flagPlanAhorro,
      EjecutivoId: ejecutivo
    };
    return solicitudCreditoHipotecario;
  }

  saveDraft(): void{
    this.showLoading();

    const solicitudCreditoHipotecario = this.getObjectToSave();
    solicitudCreditoHipotecario.EstadoId = Variables.constantes.EstadoCreaExpedienteId;

    const id = this.solicitudHipotecarioList && this.solicitudHipotecarioList.Id ? this.solicitudHipotecarioList.Id : 0;

    this.solicitudService.save(id, solicitudCreditoHipotecario)
      .then(resp => {
        if (resp) {
          this.hideLoading();
          this.showSuccessMessage('El Borrador se Guardo Correctamente');

          this.router.navigate(['/bandejas/solicitudes']);
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

  getObservacionesCPM(){
    this.generalListService.get(Variables.listas.AdmObservacionesCPM)
    .then(observacionesCPMList => this.observacionesCPMList = observacionesCPMList)
    .catch(error => console.error(error));
  }

  calculaDesembolso(){
    const precioVenta = this.creditForm.get('Precio_Venta').value;
    const AporteEfectivo = this.creditForm.get('Aporte_Efectivo').value;
    const AporteRetiroAFP = this.creditForm.get('Aporte_RetiroAFP').value;
    const BBP = this.creditForm.get('BBP').value;
    const PBP = this.creditForm.get('PBP').value;
    const PBPAdicionalSostenible = this.creditForm.get('PBP_Adiconal_Sostenible').value;
    const Desembolso = precioVenta - AporteEfectivo - AporteRetiroAFP - BBP  - PBP - PBPAdicionalSostenible;
    this.Desembolso = Desembolso;
    this.creditForm.get('Desembolso').setValue(Desembolso);

  }

  calculaGravamen(){
    const BBP = this.creditForm.get('BBP').value;
    const PBP = this.creditForm.get('PBP').value;
    const PBPAdicionalSostenible = this.creditForm.get('PBP_Adiconal_Sostenible').value;
    const Grabamen = (this.Desembolso + BBP  + PBP + PBPAdicionalSostenible) * 120 / 100;
    this.creditForm.get('Grabamen').setValue(Grabamen);
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

  send() {
    const EstadoIdOld = this.creditForm.controls.EstadoId.value;
    // let Fecha_Registro_CPM: Date;
    let EstadoId = 0;
    [0, Variables.constantes.EstadoCreaExpedienteId].includes(EstadoIdOld) && (EstadoId = Variables.constantes.EstadoRegistroCPM)/* && (Fecha_Registro_CPM = new Date())*/;
    EstadoIdOld === Variables.constantes.EstadoRegistroCPM && (EstadoId = Variables.constantes.EstadoAsignacionRiesgos);
    EstadoIdOld === Variables.constantes.EstadoAsignacionRiesgos && (EstadoId = Variables.constantes.EstadoEvaluacionRiesgos);

    const itemSave = this.getObjectToSave();
    itemSave.EstadoId = EstadoId;
    itemSave.Fecha_Estado = new Date();

    // Fecha_Registro_CPM && (itemSave.Fecha_Registro_CPM = Fecha_Registro_CPM);
    Swal.fire({
      title: '¿Esta seguro de Enviar la Solicitud?',
      showCancelButton: true,
      confirmButtonText: `Enviar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
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
      title: '¿Esta seguro de pasar la Solicitud a Revision de Observaciones?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.update(itemSave, 'La Solicitud paso a revisión', 'No se pudo pasar la Solicitud para su revisión');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  approve(): void {
    const itemSave = {
      EstadoId: 34, // TODO, create constant
      Fecha_Aprob_Verifica: new Date()
    };

    Swal.fire({
      title: '¿Esta seguro de Aprobar la Solicitud?',
      showCancelButton: true,
      confirmButtonText: `Aprobar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.update(itemSave, 'La Solicitud se Aprobó', 'No se pudo Aprobar la Solicitud');
      } else if (result.isDismissed) {
        Swal.fire('No se Envio la Solicitud', '', 'info');
      }
    });

  }

  approveWithoutVerification(): void {
    const itemSave = {
      EstadoId: 33, // TODO, create constant
      Fecha_AprobSVerifica: new Date()
    };

    Swal.fire({
      title: '¿Esta seguro de aprobar la Solicitud sin Verificación?',
      showCancelButton: true,
      confirmButtonText: `Aprobar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
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
    };
    Swal.fire({
      title: '¿Esta seguro de pasar la Solicitud para su Verificación?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
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
    };
    Swal.fire({
      title: '¿Esta seguro de pasar la Solicitud a Observación de Oficina?',
      showCancelButton: true,
      confirmButtonText: `Observar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
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
      title: '¿Esta seguro de enviar la Solicitud a Observación CPM?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
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
        this.update(itemSave, 'Ha rechazado la solicitud', 'No se pudo rechazar la Solicitud');
      }
    });

  }

  update(itemSave: any, successMessage: string, errorMessage: string): void {

    this.solicitudService.save(this.solicitudHipotecarioList.Id, itemSave)
    .then(resp => {
      console.log(resp);
      if (resp) {
        this.hideLoading();
        this.showSuccessMessage(successMessage);

        this.router.navigate(['/bandejas/solicitudes']);
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
}
