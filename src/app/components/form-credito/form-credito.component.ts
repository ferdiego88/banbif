import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralListService } from '../../shared/services/general-list.service';
import { MasterService } from '../../shared/services/master.service';
import { TipoProductoModel, TipoSubProductoModel, ZonaModel } from '../../shared/models/fisics';

@Component({
  selector: 'app-form-credito',
  templateUrl: './form-credito.component.html',
  styleUrls: ['./form-credito.component.scss']
})
export class FormCreditoComponent implements OnInit {

  tipoProductoList: TipoProductoModel;
  modalidadList: TipoProductoModel;
  oficinaList: TipoProductoModel;
  typeDocumentList: TipoProductoModel;
  sustIngresosList: TipoProductoModel;
  projectList: TipoProductoModel;
  nviviendaList: TipoProductoModel;
  currencyList: TipoProductoModel;
  TEAList: TipoProductoModel;
  typeCurrencyList: TipoProductoModel;
  paymentMethodList: TipoProductoModel;
  visitingPlaceList: TipoProductoModel;
  typeguarenteeList: TipoProductoModel;
  paymentTypeList: TipoProductoModel;

  tipoSubProductoList: TipoSubProductoModel;
  zonaModelList: ZonaModel;

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

    company: null,

    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,
    city: [null, Validators.required],
    state: [null, Validators.required],
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
    this.getZonas();
    this.getModalidad();
    this.getOficina();
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
  }
  
  setTypeCurrency(){
    this.creditForm.get('typeProduct').valueChanges.subscribe(selectedValue => {
      console.log('typeProduct value changed');
      console.log(selectedValue);
    });
    console.log(this.tipoSubProductoList);  
  }

  getTypeProducts(){
    this.generalListService.get('Tipo_Producto')
    .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
    .catch(error => console.error(error));
  }


  valueSubProducto(){
    this.creditForm.get('typeProduct').valueChanges.subscribe(selectedValue => {
      console.log('typeProduct value changed');
      console.log(selectedValue);
      this.generalListService.getSub('Sub_Producto')
      .then((tipoSubProductoList: any) =>
      this.tipoSubProductoList = tipoSubProductoList)
      .catch(error => console.error(error));
    });
    console.log(this.tipoSubProductoList);   
  }

  

  getZonas(){
    this.generalListService.get('Zona')
    .then(zonaModelList => this.zonaModelList = zonaModelList)
    .catch(error => console.error(error));
  }


  getModalidad(){
    this.generalListService.get('Modalidad')
    .then(modalidadList => this.modalidadList = modalidadList)
    .catch(error => console.error(error));
  }

  getOficina(){
    this.generalListService.get('Oficina')
    .then(oficinaList => this.oficinaList = oficinaList)
    .catch(error => console.error(error));
  }


    
  getTypeDocument(){
    this.generalListService.get('Tipo_Documento')
    .then(typeDocumentList => this.typeDocumentList = typeDocumentList)
    .catch(error => console.error(error));
  }


  getSustentoIngresos(){
    this.generalListService.get('Sustento_Ingresos')
    .then(sustIngresosList => this.sustIngresosList = sustIngresosList)
    .catch(error => console.error(error));
  }

  getProject(){
    this.generalListService.get('Proyectos')
    .then(projectList => this.projectList = projectList)
    .catch(error => console.error(error));
  }

  getNVivienda(){
    this.generalListService.get('Numero_Vivienda')
    .then(nviviendaList => this.nviviendaList = nviviendaList)
    .catch(error => console.error(error));
  }

  getCurrency(){
    this.generalListService.get('Moneda')
    .then(currencyList => this.currencyList = currencyList)
    .catch(error => console.error(error));
  }

  getTEA(){
    this.generalListService.get('TEA_Autorizada')
    .then(TEAList => this.TEAList = TEAList)
    .catch(error => console.error(error));
  }

  getTypeCurrencyPriceSale(){
    this.generalListService.get('Tipo_Moneda_PrecioVenta')
    .then(typeCurrencyList => this.typeCurrencyList = typeCurrencyList)
    .catch(error => console.error(error));
  }

  getPaymentMethod(){
    this.generalListService.get('Modalidad_Pago')
    .then(paymentMethodList => this.paymentMethodList = paymentMethodList)
    .catch(error => console.error(error));
  }

  getVisitingPlace(){
    this.generalListService.get('Lugar_Visita')
    .then(visitingPlaceList => this.visitingPlaceList = visitingPlaceList)
    .catch(error => console.error(error));
  }

  getTypeGuarentee(){
    this.generalListService.get('Tipo_Garantia')
    .then(typeguarenteeList => this.typeguarenteeList = typeguarenteeList)
    .catch(error => console.error(error));
  }

  getPaymentType(){
    this.generalListService.get('Tipo_Abono')
    .then(paymentTypeList => this.paymentTypeList = paymentTypeList)
    .catch(error => console.error(error));
  }






 

  onSubmit() {
    alert('Thanks!');
  }
  
}
