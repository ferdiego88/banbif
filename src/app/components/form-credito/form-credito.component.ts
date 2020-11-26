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
  TEAList: TipoProductoModel[];
  typeCurrencyList: TipoProductoModel[];
  paymentMethodList: TipoProductoModel[];
  visitingPlaceList: TipoProductoModel[];
  typeguarenteeList: TipoProductoModel[];
  paymentTypeList: TipoProductoModel[];
  tipoSubProductoList: TipoSubProductoModel[];
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

  creditForm = this.fb.group({
    typeProduct: [null, Validators.required],
    ejecutivo: [null, Validators.required],
    subProducto: [null, Validators.required],
    zona: [null, Validators.required],
    modalidad: [null, Validators.required],
    oficina: [null, Validators.required],
    tipoDcmto: [null, Validators.required],
    nroDcmto: [null, Validators.required],
    nombreTitular: [null, Validators.required],
    riesgoMaximo: [null, Validators.required],
    sustentoIngresos: [null, Validators.required],
    nombreProyecto: [null, Validators.required],
    numeroVivienda: [null, Validators.required],
    tipoMoneda: [null, Validators.required],
    TEA: [null, Validators.required],
    teaAuth: [null, Validators.required],
    tipoprecioVenta: [null, Validators.required],
    precioVenta: [null, Validators.required],
    pFinanciamiento: [null, Validators.required],
    monedaDesembolso: [null, Validators.required],
    desembolso: [null, Validators.required],
    monedagravamen: [null, Validators.required],
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

  constructor(
    private fb: FormBuilder,
    private generalListService: GeneralListService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
   this.cargarCombos();


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
    this.getTEA();
    this.getTypeCurrencyPriceSale();
    this.getPaymentMethod();
    this.getVisitingPlace();
    this.getTypeGuarentee();
    this.getPaymentType();
    this.getTypeCurrencySaving();
    this.getPlanSituationSaving();
    this.getLastValidatedBono();
  }

  getTypeProducts(){
    this.generalListService.get(Variables.listas.AdmTipoProducto)
    .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
    .catch(error => console.error(error));
  }

  valueSubProducto(): any{
    this.creditForm.get('typeProduct').valueChanges.subscribe(selectedValue => {
      // clean array
      this.tipoSubProductoList = [];
      switch (selectedValue) {
        case Variables.constantes.TipoProductoMiViviendaId:
          this.showmessageVivienda = true;
          this.showBotonesProducto = true;
          this.showPVenta = true;
          this.showGarantias = false;
          this.showCuotaInicial = true;
          this.showBuenPagador = true;
          break;
        case Variables.constantes.TipoProductoCompraDeudaId:
          this.showBotonesProducto = false;
          this.showPVenta = true;
          this.showmessageVivienda = false;
          this.showGarantias = false;
          this.showCuotaInicial = true;
          this.showBuenPagador = false;
          break;
        case Variables.constantes.TipoProductoAmpliacionRemodelacionConstruccionId:
          this.showGarantias = true;
          this.showPVenta = false;
          this.showBotonesProducto = false;
          this.showmessageVivienda = false;
          this.showCuotaInicial = false;
          this.showBuenPagador = false;
          break;
        case Variables.constantes.TipoProductoHipotecarioId:
          this.showGarantias = false;
          this.showPVenta = true;
          this.showBotonesProducto = true;
          this.showmessageVivienda = false;
          this.showCuotaInicial = true;
          this.showBuenPagador = false;
          break;

        default:
          this.showGarantias = false;
          this.showPVenta = true;
          this.showBotonesProducto = true;
          this.showmessageVivienda = false;
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

}
