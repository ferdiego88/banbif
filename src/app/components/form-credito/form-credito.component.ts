import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GeneralListService } from '../../shared/services/general-list.service';
import { MasterService } from '../../shared/services/master.service';
import { TipoProductoModel, TipoSubProductoModel, ZonaModel } from '../../shared/models/fisics';
import { Variables } from 'src/app/shared/variables';

// import {default as _rollupMoment} from 'moment';
import * as _moment from 'moment';
const moment = _moment;
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM YYYY',
  },
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
export class FormCreditoComponent implements OnInit {
  date = new FormControl(moment());


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
  typeguarenteeList: TipoProductoModel[];
  paymentTypeList: TipoProductoModel[];
  tipoSubProductoList: TipoSubProductoModel[];
  estadoList: TipoProductoModel[];
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

  showBtnGuardarBorrador = true;
  showBtnCancelar = true;
  showBtnEnviar = true;
  showBtnEnviarRegularizar = true;
  showBtnObservar = true;



  creditForm = this.fb.group({
    typeProduct: [null, Validators.required],
    ejecutivo: [null, Validators.required],
    subProducto: [null, Validators.required],
    zona: [null, Validators.required],
    modalidad: [null, Validators.required],
    oficina: [null, Validators.required],
    Estado: [null, Validators.required],
    tipoDcmto: [null, Validators.required],
    nroDcmto: [null, Validators.required],
    nombreTitular: [null, Validators.required],
    riesgoMaximo: [null, Validators.required],
    sustentoIngresos: [null, Validators.required],
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
    Mon_PBP: [null, Validators.required],
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
    Cta_Ahorro_Banbif: [null, Validators.required],
    /*Fin Plan Ahorro */

    /* Cuota Inicial*/
    Mon_Ap_Efectivo: [null, Validators.required],
    Aporte_Efectivo: [null, Validators.required],
    Mon_Aport_AFP: [null, Validators.required],
    Aporte_RetiroAFP: [null, Validators.required],
    BBP_Adicional: [null, Validators.required],
    PBP_Adicional_Sostenible: [null, Validators.required],
    /* Fin Cuota Inicial*/

    /* Ini Garantias*/
    Descripcion_Inmueble: [null, Validators.required],
    Fecha_Tasacion_Remodelac: [null, Validators.required],
    Mon_ValorComTas_Soles: [null, Validators.required],
    ValorComTas_Soles: [null, Validators.required],
    Mon_VRI_Soles: [null, Validators.required],
    VRI_Soles: [null, Validators.required],
    /* Fin Garantias*/
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
    private masterService: MasterService
  ) {}

  ngOnInit() {
   this.cargarCombos();
   this.cargarListeners();
   this.creditForm.get('Estado').disable();
   this.creditForm.get('Estado').setValue(1);
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
    this.getTypeGuarentee();
    this.getPaymentType();
    this.getTypeCurrencySaving();
    this.getPlanSituationSaving();
    this.getLastValidatedBono();
    this.getEstado();
    this.getBBPAdicional();
  }

  getTypeProducts(){
    this.generalListService.get(Variables.listas.AdmTipoProducto, 'Title')
    .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
    .catch(error => console.error(error));
  }

  setearMonedasSoles(){
    this.creditForm.get('Moneda').setValue(Variables.constantes.TipoMonedaSolesDatosOperacionId);
    this.creditForm.get('monedaDesembolso').setValue(Variables.constantes.TipoMonedaSolesPrecioVentaId);
    this.creditForm.get('monedagravamen').setValue(Variables.constantes.TipoMonedaSolesPrecioVentaId);
    this.creditForm.get('tipoprecioVenta').setValue(Variables.constantes.TipoMonedaSolesPrecioVentaId);
    this.creditForm.get('Mon_Ap_Efectivo').setValue(Variables.constantes.TipoMonedaSolesDatosAporteEfectivoId);
    this.creditForm.get('Mon_Aport_AFP').setValue(Variables.constantes.TipoMonedaSolesMonteAporteAFPId);
    this.creditForm.get('Mon_BBP').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_PBP').setValue(Variables.constantes.SimboloSoles);
  }
  setearMonedasEmpty(){
    this.creditForm.get('Moneda').setValue('');
    this.creditForm.get('monedaDesembolso').setValue('');
    this.creditForm.get('monedagravamen').setValue('');
    this.creditForm.get('tipoprecioVenta').setValue('');
    this.creditForm.get('Mon_Ap_Efectivo').setValue('');
    this.creditForm.get('Mon_Aport_AFP').setValue('');
    this.creditForm.get('Mon_BBP').setValue('');
    this.creditForm.get('Mon_PBP').setValue('');
  }

  setearTipoMoneda(simbolo: string, idtipo: number){
        this.creditForm.get('Mon_BBP').setValue(simbolo);
        this.creditForm.get('Mon_PBP').setValue(simbolo);
        this.creditForm.get('monedaDesembolso').setValue(idtipo);
        this.creditForm.get('monedagravamen').setValue(idtipo);
  }

  setPlanAhorroEmpty(){
    this.creditForm.get('Meses_Abono').setValue('');
    this.creditForm.get('Importe_Cuota_Ahorro').setValue('');
    this.creditForm.get('Tipo_Moneda_Ahorro').setValue('');
    this.creditForm.get('Situacion_Plan_Ahorro').setValue('');
    this.creditForm.get('N_Abonos_Validados').setValue('');
    this.creditForm.get('Ultimo_Abono_Validado').setValue('');
    this.creditForm.get('Cta_Ahorro_Banbif').setValue('');
  }
  setPlanAhorroUntouched(){
    this.creditForm.get('Meses_Abono').markAsUntouched();
    this.creditForm.get('Importe_Cuota_Ahorro').markAsUntouched();
    this.creditForm.get('Tipo_Moneda_Ahorro').markAsUntouched();
    this.creditForm.get('Situacion_Plan_Ahorro').markAsUntouched();
    this.creditForm.get('N_Abonos_Validados').markAsUntouched();
    this.creditForm.get('Ultimo_Abono_Validado').markAsUntouched();
    this.creditForm.get('Cta_Ahorro_Banbif').markAsUntouched();
  }

  setMonedaGarantia(){
    this.creditForm.get('Mon_ValorComTas_Soles').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_ValorComTas_Soles').disable();
    this.creditForm.get('Mon_VRI_Soles').setValue(Variables.constantes.SimboloSoles);
    this.creditForm.get('Mon_VRI_Soles').disable();
  }

  listenerBonoBuenPagador(){
    this.creditForm.get('precioVenta').valueChanges.subscribe(selectedValue =>{
        console.log(selectedValue);
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
        case (selectedValue <= Variables.constantes.PrecioVenta6):
            this.creditForm.get('PBP').setValue(Variables.constantes.BonoBuenPagador5);
            break;
        case ( selectedValue >= Variables.constantes.PrecioVenta3 && selectedValue <= Variables.constantes.PrecioVenta4):
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador2);
            break;
        case ( selectedValue >= Variables.constantes.PrecioVenta1 && selectedValue <= Variables.constantes.PrecioVenta2):
            this.creditForm.get('BBP').setValue(Variables.constantes.BonoBuenPagador1);
            break;
          default:
            this.creditForm.get('BBP').setValue('');
            this.creditForm.get('PBP').setValue('');
            break;
        }
    });
  }
  listenerBotones(){
    this.creditForm.get('Estado').valueChanges.subscribe(selectedValue => {
        console.log('Estado es:' + selectedValue);
        switch (true) {
        case ( selectedValue === Variables.constantes.EstadoCreaExpedienteId):
          this.showBtnEnviarRegularizar = false;
          break;
        case ( selectedValue === Variables.constantes.EstadoRegistroCPM):
          this.showBtnGuardarBorrador = false;
          break;
        case ( selectedValue === Variables.constantes.EstadoObservadoCPM):
          this.showBtnEnviarRegularizar = false;
          break;
        case ( selectedValue !== Variables.constantes.EstadoRegistroCPM):
          this.showBtnObservar = false;
          break;
        default:
            break;
        }
    });
  }


  cargarListeners(){
    this.listenerTipoMoneda();
    this.setMonedaGarantia();
    this.listenerBonoBuenPagador();
    this.listenerBotones();
  }




  listenerTipoMoneda(){
    this.creditForm.get('Moneda').valueChanges.subscribe(selectedValue =>{
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
          break;
        case Variables.constantes.TipoProductoCompraDeudaId:
          this.showBotonesProducto = false;
          this.showPVenta = true;
          this.showmessageVivienda = false;
          this.showGarantias = false;
          this.showCuotaInicial = true;
          this.showBuenPagador = false;
          this.showBuenAplicacion = false;
          this.setearMonedasEmpty();
          break;
        case Variables.constantes.TipoProductoAmpliacionRemodelacionConstruccionId:
          this.showGarantias = true;
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
      console.log('typeProduct value changed');
      console.log(selectedValue);
      this.generalListService.getByField(Variables.listas.AdmTipoSubProducto, Variables.listas.AdmTipoProductoId, selectedValue)
        .then((tipoSubProductoList: any) => this.tipoSubProductoList = tipoSubProductoList)
        .catch(error => console.error(error));
    });
    console.log(this.tipoSubProductoList);
  }


  valueModalidad(): any{
    this.creditForm.get('typeProduct').valueChanges.subscribe(selectedValue => {
      // clean array
      this.modalidadList = [];
      console.log('typeProduct value changed');
      console.log(selectedValue);
      this.generalListService.getByField(Variables.listas.AdmModalidad, Variables.listas.AdmModalidadProductoId, selectedValue)
        .then((modalidadList: any) => this.modalidadList = modalidadList)
        .catch(error => console.error(error));
    });
    console.log(this.modalidadList);
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
      console.log('zona value changed');
      console.log(selectedValue);
      this.generalListService.getByField(Variables.listas.AdmOficina, Variables.listas.AdmZonaId, selectedValue)
        .then((oficinaList: any) => this.oficinaList = oficinaList)
        .catch(error => console.error(error));
    });
    console.log(this.oficinaList);
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
    this.generalListService.get(Variables.listas.AdmProyectos)
    .then(projectList => this.projectList = projectList)
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

  getTypeGuarentee(){
    this.generalListService.get(Variables.listas.AdmTipoGarantia)
    .then(typeguarenteeList => this.typeguarenteeList = typeguarenteeList)
    .catch(error => console.error(error));
  }

  getPaymentType(){
    this.generalListService.get(Variables.listas.AdmTipoAbono)
    .then(paymentTypeList => this.paymentTypeList = paymentTypeList)
    .catch(error => console.error(error));
  }

  CalificacionTradicional() {
    this.showSaving = false;
    this.setPlanAhorroUntouched();
    this.setPlanAhorroEmpty();
  }

  PlanAhorro() {
    this.showSaving = true;
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

  calculaDesembolso(){
    const precioVenta = this.creditForm.get('precioVenta').value;
    const AporteEfectivo = this.creditForm.get('Aporte_Efectivo').value;
    const AporteRetiroAFP = this.creditForm.get('Aporte_RetiroAFP').value;
    const BBP = this.creditForm.get('BBP').value;
    const PBP = this.creditForm.get('PBP').value;
    const PBPAdicionalSostenible = this.creditForm.get('PBP_Adicional_Sostenible').value;
    const desembolso = precioVenta - AporteEfectivo - AporteRetiroAFP - BBP  - PBP - PBPAdicionalSostenible;
    this.desembolso = desembolso;
    this.creditForm.get('desembolso').setValue(desembolso);

  }

  calculaGravamen(){
    const BBP = this.creditForm.get('BBP').value;
    const PBP = this.creditForm.get('PBP').value;
    const PBPAdicionalSostenible = this.creditForm.get('PBP_Adicional_Sostenible').value;
    const gravamen = (this.desembolso + BBP  + PBP + PBPAdicionalSostenible) * 120 / 100;
    this.creditForm.get('gravamen').setValue(gravamen);
  }



}
