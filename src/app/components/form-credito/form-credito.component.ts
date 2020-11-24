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
  tipoSubProductoList: TipoSubProductoModel;
  zonaModelList: ZonaModel;

  creditForm = this.fb.group({
    typeProduct: [null, Validators.required],
    ejecutivo: [null, Validators.required],
    subProducto: [null, Validators.required],
    zona: [null, Validators.required],
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

  states = [
    {name: 'Alabama', abbreviation: 'AL'},
    {name: 'Alaska', abbreviation: 'AK'},
    {name: 'American Samoa', abbreviation: 'AS'},
    {name: 'Arizona', abbreviation: 'AZ'},
    {name: 'Arkansas', abbreviation: 'AR'},
    {name: 'California', abbreviation: 'CA'},
    {name: 'Colorado', abbreviation: 'CO'},
    {name: 'Connecticut', abbreviation: 'CT'},
    {name: 'Delaware', abbreviation: 'DE'},

  ];

  constructor(
    private fb: FormBuilder,
    private generalListService: GeneralListService,
    private masterService: MasterService 
  ) {}

  ngOnInit() {
   
     this.getTypeProducts();
     this.getZonas();
     this.valueSubProducto();
     
  }
  


  getTypeProducts(){
    this.generalListService.get('Tipo_Producto')
    .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
    .catch(error => console.error(error));
  }

  getZonas(){
    this.generalListService.get('Zona')
    .then(zonaModelList => this.zonaModelList = zonaModelList)
    .catch(error => console.error(error));
  }

  valueSubProducto(){
    this.creditForm.get('typeProduct').valueChanges.subscribe(selectedValue => {
      console.log('typeProduct value changed');
      console.log(selectedValue);                            // latest value of firstname
      console.log(this.creditForm.get('typeProduct').value); // latest value of firstname
    });

  }

  onSubmit() {
    alert('Thanks!');
  }
  
}
