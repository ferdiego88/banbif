import {
  Component,
  OnInit,
  ApplicationRef,
  NgZone,
  Inject,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DOCUMENT } from '@angular/common';
import { MatExpansionPanel } from '@angular/material/expansion';

import { Deferred } from 'ts-deferred';
import { List } from 'linqts';
import { SpinnerVisibilityService } from 'ng-http-loader';

import { IFieldInfo } from '@pnp/sp/fields';
import { IEmailProperties } from '@pnp/sp/sputilities';

import { environment } from 'src/environments/environment';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';

import { IStatistics } from 'src/app/shared/models/fisics/IStatistics';
import { MasterLogic } from 'src/app/shared/models/logics/MasterLogic';

import { MasterService } from 'src/app/shared/services/master.service';
import { MaestroDesplegables } from 'src/app/shared/models/fisics/MaestroDesplegables';
import { MaestroMaterial } from '../../shared/models/fisics/MaestroMaterial';
import { MaestroFLujoEtapa } from 'src/app/shared/models/fisics/MaestroFLujoEtapa';
import { MaestroLinea } from '../../shared/models/fisics/MaestroLinea';

import { Variables } from 'src/app/shared/variables';

import { errorMessagesSolicitudForm, MyErrorStateMatcher } from '../../shared/validators/global.validator';

import { HistorialSolicitudComponent } from '../../shared/components/historial-solicitud/historial-solicitud.component';
import { HostListener } from '@angular/core';
import { ExportExcelService } from '../../shared/services/export-excel.service';
import { MaestroCampos } from '../../shared/models/fisics/MaestroCampos';
import { FileUploadComponent } from '../../shared/controls/file-upload/file-upload.component';
import { MaestroMaterialDocs } from '../../shared/models/fisics/MaestroMaterialDocs';
import { MaestroMaterialDocsService } from '../../shared/services/maestro-material-docs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as FileSaver from 'file-saver';
import { Funciones } from '../../shared/funciones';
import { ExcelService } from '../../shared/services/excel.service';
import { Log } from '../../shared/models/fisics/Log';
import '../../shared/extensions/string.extension';

declare var $:any;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY'
  }
};

@Component({
  selector: 'app-formulario-solicitud',
  templateUrl: './formulario-solicitud.component.html',
  styleUrls: ['./formulario-solicitud.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    }
  ]
})
export class FormularioSolicitudComponent extends FormularioBase implements OnInit {

  files: File[];
  maestroMaterialDocs: MaestroMaterialDocs[] = [];

  screenHeight: number;

  modified: string;

  botonBorrador = true;
  botonGuardar = true;
  botonRechazar = false;
  botonCancelar = true;
  botonHistorial = false;

  matcher = new MyErrorStateMatcher();
  errors = errorMessagesSolicitudForm;

  renderizar = false;
  maestroMaterial: MaestroMaterial;
  indexEtapaActual: number;

  maestroFlujoEtapaSiguiente: MaestroFLujoEtapa;
  maestroFlujoEtapaActual: MaestroFLujoEtapa;

  buttonGuardarName: string;

  esMiembroId: boolean;
  currentUserName: string = '';
  statistics: IStatistics;
  variables: Variables = new Variables();

  idFormularioSolicitud: number;

  listaFormaFarmaceutica: MaestroDesplegables[];
  listaFormaFarmaceuticaFilter: MaestroDesplegables[];

  listaGrupoImputacionMaterial: MaestroDesplegables[];
  listaGrupoImputacionMaterialFilter: MaestroDesplegables[];

  listaTipoMaterial: MaestroDesplegables[];
  listaTipoMaterialFilter: MaestroDesplegables[];

  listaGrupoArticulo: MaestroDesplegables[];
  listaGrupoArticuloFilter: MaestroDesplegables[];

  listaGrupoCompra: MaestroDesplegables[];
  listaGrupoCompraFilter: MaestroDesplegables[];

  listaCondicionAlmacenaje: MaestroDesplegables[];
  listaCondicionAlmacenajeFilter: MaestroDesplegables[];

  listaJerarquiaProducto2: MaestroDesplegables[];
  listaJerarquiaProducto2Filter: MaestroDesplegables[];

  listaJerarquiaProducto3: MaestroDesplegables[];
  listaJerarquiaProducto3Filter: MaestroDesplegables[];

  listaJerarquiaProducto4: MaestroDesplegables[];
  listaJerarquiaProducto4Filter: MaestroDesplegables[];

  listaJerarquiaProducto5: MaestroDesplegables[];
  listaJerarquiaProducto5Filter: MaestroDesplegables[];

  listaCT1: MaestroDesplegables[];
  listaCT1Filter: MaestroDesplegables[];

  listaCT2: MaestroDesplegables[];
  listaCT2Filter: MaestroDesplegables[];

  listaCT3: MaestroDesplegables[];
  listaCT3Filter: MaestroDesplegables[];

  listaCT4: MaestroDesplegables[];
  listaCT4Filter: MaestroDesplegables[];

  listaLinea: MaestroLinea[];

  listaProveedorSAP: any[];

  camposEnable: {};
  camposEstructura: IFieldInfo[];

  displayedColumnAdjunto = ['Nombre', 'TipoDocumentoAdjunto', 'CreadoPor', 'Actions'];
  maestroMaterialDocsDS: MatTableDataSource<MaestroMaterialDocs>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild('InformacionProducto')      seccionInformacionProducto: MatExpansionPanel;
  @ViewChild('DatosGestion')             seccionDatosGestion: MatExpansionPanel;
  @ViewChild('DatosTecnicos')            seccionDatosTecnicos: MatExpansionPanel;
  @ViewChild('DatosAdicionales')         seccionDatosAdicionales: MatExpansionPanel;
  @ViewChild('UnidadesMedidaUnidad')     seccionUnidadesMedidaUnidad: MatExpansionPanel;
  @ViewChild('UnidadesMedidaMasterPack') seccionUnidadesMedidaMasterPack: MatExpansionPanel;
  @ViewChild('OtrosDatosRDM')            seccionOtrosDatosRDM: MatExpansionPanel;

  constructor(
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public masterService: MasterService,
    public zone: NgZone,
    public formBuilder: FormBuilder,
    public _spinner: SpinnerVisibilityService,
    @Inject(DOCUMENT) document: any,
    private exportExcelService: ExportExcelService,
    private maestroMaterialDocsService: MaestroMaterialDocsService,
    private excelService: ExcelService
  ) {
    super(
      'Formulario de Solicitud',
      applicationRef,
      dialog,
      route,
      router,
      masterService,
      zone,
      _spinner
    );

    this.esMiembroId = false;

    this.form = this.formBuilder.group({
    });

    // this.camposEstado = new Array<IFCampoEstado>();
    this.camposEnable = {};
  }

  ngOnInit(): void {
    // this.nombrePagina = 'Formulario de Solicitud';
    this.getScreenSize();
    this.cargarDatosPagina();

  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?): void {
    this.screenHeight = window.innerHeight;
  }

  cargarDatosPagina(): void {
    this.mostrarProgreso();
    this.statistics = <IStatistics>{};

    this.masterService.getEstructuraLista( Variables.lists.MaestroMaterial ).then(
      data => {
        this.camposEstructura = data;
        // console.log(this.camposEstructura);
        this.obtenerMaestrosYDatos().then(
          () => {
            this.currentUserName = this.datosMaestros.currentUser.Title;
            this.getMaestroMaterial();
          },
          err => this.guardarLog( err )
        );

      },
      err => this.guardarLog( err )
    );
  }

  validaNuevaSolicitud(): void {
    if (!Funciones.validaNuevaSolicitud( this.datosMaestros.maestroLinea, this.datosMaestros.currentUser.Id )) {
      this.alertaNoResponsableEtapa();
      this.router.navigate(['/home']);
    };
  }

  alertaNoResponsableEtapa(): void {
    this.mostrarModalInformativo('', 'Usted no es el Responsable de la Etapa.');
  }

  getMaestroMaterial(): void {
    this.route.params.subscribe(
      param => {
        this.idFormularioSolicitud = +param['id'];

        this.maestroMaterial = new MaestroMaterial();

        if (this.files !== undefined && this.files.length > 0) {
          this.files.splice(0, this.files.length - 1);
        }

        // this.maestroMaterialDocs.push( new MaestroMaterialDocs() );
        // console.log(this.maestroMaterialDocs);
        if ( this.idFormularioSolicitud === -1 ) {
          // console.log(this.maestroMaterial);
          // this.idMaestroFlujoEtapaActual = this.datosMaestros.maestroFLujoEtapa[0].Id;
          this.validaNuevaSolicitud();
          this.maestroFlujoEtapaActual = this.datosMaestros.maestroFLujoEtapa[0];
          // this.traeGrupoParticipantePorEtapa( this.maestroFlujoEtapaActual.Id );
          this.habilitaCamposEtapaActual();

        } else {

          this.masterService.getMaestroMaterial( this.idFormularioSolicitud ).then(
            (resp: any) => {
              // console.log(resp);
              this.botonHistorial = true;
              this.modified = resp.Modified;
              this.masterService.setObject( this.maestroMaterial, resp );

              //Seteamos Responsables
              this.maestroMaterial.ResponsableLaboratorioObj = resp.ResponsableLaboratorio;
              this.maestroMaterial.EjecutivoComercialObj = resp.EjecutivoComercial;
              this.maestroMaterial.ResponsableDTObj = resp.ResponsableDT;
              this.maestroMaterial.ResponsableRDMObj = resp.ResponsableRDM;
              // console.log(this.maestroMaterial);

              const maestroFlujoEtapaList = new List<MaestroFLujoEtapa>(
                this.datosMaestros.maestroFLujoEtapa
              ).Where( etapa => etapa.Id === this.maestroMaterial.MaestroFLujoEtapaId ).ToArray();

              this.maestroFlujoEtapaActual = maestroFlujoEtapaList[0];

              this.maestroMaterialDocsService.getMaestroMaterialDocs( this.idFormularioSolicitud ).then(
                (docs: MaestroMaterialDocs[]) => {

                  this.maestroMaterialDocs = docs;
                  // console.log({adjuntos: this.maestroMaterialDocs});

                  this.loadTableDocumentosAdjuntos();

                  this.habilitaCamposEtapaActual();
                  this.validaResponsableEtapa();
                },
                err => this.guardarLog( err )
              );

            },
            err => this.guardarLog( err )
          );

        }
      }
    );
  }

  validaResponsableEtapa(): void {

    if (this.maestroMaterial.Id > 0) {
      let campoResponsable = '';

      // console.log(this.maestroFlujoEtapaActual);

      switch (this.maestroFlujoEtapaActual.Abreviatura) {
        case 'LAB':
          campoResponsable = 'ResponsableLaboratorioObj';
          break;

        case 'EECC':
          campoResponsable = 'EjecutivoComercialObj';
          break;

        case 'DT':
          campoResponsable = 'ResponsableDTObj';
          break;

        case 'RDM':
          campoResponsable = 'ResponsableRDMObj';
          break;
      }

      // console.log(campoResponsable);
      // console.log(this.maestroMaterial);

      if (campoResponsable !== '') {
        if (this.maestroMaterial[campoResponsable][0].Id !== this.datosMaestros.currentUser.Id) {
          this.alertaNoResponsableEtapa();

          Object.keys( this.form.value ).forEach(
            key => {
              this.form.controls[key].disable();
            }
          );

          this.botonBorrador = false;
          this.botonGuardar = false;
          this.botonRechazar = false;

        }
      }
    }

  }

  habilitaCamposEtapaActual(): void {

    this.datosMaestros.maestroCampos.forEach(
      campo => {
        campo.MaestroFlujoEtapa.forEach(
          (etapa: any) => {
            if (etapa.Id === this.maestroFlujoEtapaActual.Id) {
              this.camposEnable[campo.Title] = campo.Title;
            }
          }
        );
      }
    );

    this.creaControles();
    this.creaControlesFilter();
    this.cargaFilters();
    this.cargaListeners();
    this.cargaValoresInicialesFormControls();
    this.renderizar = true;
    this.buscaEtapaSiguiente();
    this.verificaEstadoVisualizacionBotones();
    this.ocultarProgreso();
  }

  verificaEstadoVisualizacionBotones(): void {
    if (this.maestroFlujoEtapaActual.Rechazo > 0) {
      this.botonCancelar = false;
      this.botonRechazar = true;
    }

    if (this.maestroFlujoEtapaSiguiente !== undefined ) {
      this.buttonGuardarName = this.maestroFlujoEtapaSiguiente.Title;
    } else {
      this.botonGuardar = false;
      this.botonBorrador = false;
      this.botonCancelar = false;
    }
  }

  buscaEtapaSiguiente(): void {
    let IdEtapaSiguiente = 0;

    if (this.maestroFlujoEtapaActual.IdEtapaSiguienteEspecificacionTe > 0) {
      if (this.maestroMaterial.IdReqEspeTecnica === Variables.constantes.IdSiRequiereEspecificacionTecnica) {
        IdEtapaSiguiente = this.maestroFlujoEtapaActual.IdEtapaSiguienteEspecificacionTe;
      } else {
        IdEtapaSiguiente = this.maestroFlujoEtapaActual.IdEtapaSiguiente;
      }
    } else {
      IdEtapaSiguiente = this.maestroFlujoEtapaActual.IdEtapaSiguiente;
    }

    this.maestroFlujoEtapaSiguiente = this.datosMaestros.maestroFLujoEtapa.filter( item => item.Id === IdEtapaSiguiente )[0];
  }

  creaControles(): void {
    // console.log(this.camposEstructura);
    this.datosMaestros.maestroCampos.forEach( campo => this.addControl( campo ) );
    // console.log(this.form);
  }

  addControl(campo): void {

    // console.log(this.camposEnable);
    const disabled = this.camposEnable[campo.Title] === undefined;

    // console.log(this.maestroMaterial);
    const validator = !disabled && campo.Title !== Variables.columns.CodigoOp ? [Validators.required] : [];
    const campoEstructura = this.camposEstructura.filter(
      campoEstructuraF => campoEstructuraF.Title === campo.Title || campoEstructuraF.InternalName === campo.Title
    );

    if (campoEstructura[0] !== undefined) {
      const type = campoEstructura[0].TypeAsString;

      switch (type) {
        case 'Text':
          const maxLength = campoEstructura[0]['MaxLength'];
          if (maxLength && maxLength > 0) {
            validator.push( Validators.maxLength( maxLength ) );
            if (['UVEanUpc', 'MPEAN14'].includes(campo.Title)) {
              validator.push( Validators.minLength( maxLength ) );
            }
          }
          break;

        case 'Number':
          const min = campoEstructura[0]['MinimumValue'];
          const max = campoEstructura[0]['MaximumValue'];

          if (min && min > 0) {
            validator.push( Validators.min( min ) );
          } else {
            validator.push( Validators.min( 1 ) );
          }

          if (max && max > 0) {
            validator.push( Validators.max( max ) );
          }

          break;
      }



      this.form.addControl(campo.Title, new FormControl({value: '', disabled: disabled}, validator));
      // this.form.addControl(campo.Title, new FormControl('', validator));
    }
  }

  creaControlesFilter(): void {
    this.form.addControl('formaFarmaceuticaFilter', new FormControl(''));
    this.form.addControl('tipoMaterialFilter', new FormControl(''));
    this.form.addControl('grupoArticuloFilter', new FormControl(''));
    this.form.addControl('grupoCompraFilter', new FormControl(''));
    this.form.addControl('condicionAlmacenajeFilter', new FormControl(''));
    this.form.addControl('jerarquiaProducto2Filter', new FormControl(''));
    this.form.addControl('jerarquiaProducto3Filter', new FormControl(''));
    this.form.addControl('jerarquiaProducto4Filter', new FormControl(''));
    this.form.addControl('jerarquiaProducto5Filter', new FormControl(''));
    this.form.addControl('grupoImputacionMaterialFilter', new FormControl(''));
  }

  cargaValoresInicialesFormControls() {

    for ( const prop in this.form.controls ) {
      if ( this.maestroMaterial[prop] !== undefined && this.maestroMaterial[prop] !== null ) {
        if (prop === Variables.columns.IdCanalDistribucion) {
          const canalesDistribucion = this.maestroMaterial.IdCanalDistribucion.split(',').map(item => +item);
           // console.log({canalesDistribucion});
          this.form.controls[prop].setValue(canalesDistribucion);
        } else {
          this.form.controls[prop].setValue(this.maestroMaterial[prop])
        }
      }
    }
    // console.log(this.form);
  }

  cargaFilters() {
    this.cargaListaTipoMaterial();
    this.cargaListaGrupoArticulo();
    this.cargaListaGrupoCompra();
    this.cargaListaCondicionAlmacenaje();
    this.cargaListaCT1();
    this.cargaListaLinea();
    this.cargaListaGrupoImputacionMaterial();
    this.cargaListaFormaFarmaceutica();
  }

  cargaListaFormaFarmaceutica() {
    this.listaFormaFarmaceutica = this.obtenerListaDesplegablesPorTipo( this.variables.ColumnasMaestroDesplegables.FormaFarmaceutica );
    this.listaFormaFarmaceuticaFilter = this.listaFormaFarmaceutica;
  }

  cargaListaGrupoImputacionMaterial() {
    this.listaGrupoImputacionMaterial = this.obtenerListaDesplegablesPorTipo( this.variables.ColumnasMaestroDesplegables.GrupoImputacionMaterial );
    this.listaGrupoImputacionMaterialFilter = this.listaGrupoImputacionMaterial;
  }

  cargaListaTipoMaterial() {
    this.listaTipoMaterial = this.obtenerListaDesplegablesPorTipo( this.variables.ColumnasMaestroDesplegables.TipoMaterial );
    this.listaTipoMaterialFilter = this.listaTipoMaterial;
  }

  cargaListaGrupoArticulo() {
    this.listaGrupoArticulo = this.obtenerListaDesplegablesPorTipo( this.variables.ColumnasMaestroDesplegables.GrupoArticuloExterno );
    this.listaGrupoArticuloFilter = this.listaGrupoArticulo;
  }

  cargaListaGrupoCompra() {
    this.listaGrupoCompra = this.obtenerListaDesplegablesPorTipo( this.variables.ColumnasMaestroDesplegables.GrupoCompras );
    this.listaGrupoCompraFilter = this.listaGrupoCompra;
  }

  cargaListaCondicionAlmacenaje() {
    this.listaCondicionAlmacenaje = this.obtenerListaDesplegablesPorTipo( this.variables.ColumnasMaestroDesplegables.CondicionAlmacenaje );
    this.listaCondicionAlmacenajeFilter = this.listaCondicionAlmacenaje;
  }

  cargaListaJerarquiaProducto2( idJerarquiaProducto1: number ) {
    this.listaJerarquiaProducto2 = this.obtenerListaDesplegablesPorTipoYPadre( this.variables.ColumnasMaestroDesplegables.Jerarquia2, idJerarquiaProducto1 );
    this.listaJerarquiaProducto2Filter = this.listaJerarquiaProducto2;

    this.form.controls['IdJerarquiProducto2'].setValue(-1);
  }

  cargaListaJerarquiaProducto3( idJerarquiaProducto2: number ) {
    this.listaJerarquiaProducto3 = this.obtenerListaDesplegablesPorTipoYPadre( this.variables.ColumnasMaestroDesplegables.Jerarquia3, idJerarquiaProducto2 );
    this.listaJerarquiaProducto3Filter = this.listaJerarquiaProducto3;

    this.form.controls['IdJerarquiProducto3'].setValue(-1);
  }

  cargaListaJerarquiaProducto4( idJerarquiaProducto3: number ) {
    this.listaJerarquiaProducto4 = this.obtenerListaDesplegablesPorTipoYPadre( this.variables.ColumnasMaestroDesplegables.Jerarquia4, idJerarquiaProducto3 );
    this.listaJerarquiaProducto4Filter = this.listaJerarquiaProducto4;

    this.form.controls['IdJerarquiProducto4'].setValue(-1);
  }

  cargaListaJerarquiaProducto5( idJerarquiaProducto4: number ) {
    this.listaJerarquiaProducto5 = this.obtenerListaDesplegablesPorTipoYPadre( this.variables.ColumnasMaestroDesplegables.Jerarquia5, idJerarquiaProducto4 );
    this.listaJerarquiaProducto5Filter = this.listaJerarquiaProducto5;

    this.form.controls['IdJerarquiProducto5'].setValue(-1);
  }

  cargaListaCT1() {
    this.listaCT1 = this.obtenerListaDesplegablesPorTipo( this.variables.ColumnasMaestroDesplegables.ClaseTerapeutica1 );
  }

  cargaListaCT2( idCT1: number ) {
    this.listaCT2 = this.obtenerListaDesplegablesPorTipoYPadre( this.variables.ColumnasMaestroDesplegables.ClaseTerapeutica2, idCT1 );
    // this.listaJerarquiaProducto2Filter = this.listaJerarquiaProducto2;

    this.form.controls['IdCT2'].setValue(-1);
  }

  cargaListaCT3( idCT2: number ) {
    this.listaCT3 = this.obtenerListaDesplegablesPorTipoYPadre( this.variables.ColumnasMaestroDesplegables.ClaseTerapeutica3, idCT2 );
    this.form.controls['IdCT3'].setValue(-1);
  }

  cargaListaCT4( idCT3: number ) {
    this.listaCT4 = this.obtenerListaDesplegablesPorTipoYPadre( this.variables.ColumnasMaestroDesplegables.ClaseTerapeutica4, idCT3 );
    this.form.controls['IdCT4'].setValue(-1);
  }

  cargaListaLinea() {

    const currentUserEmail = this.datosMaestros.currentUser.Email;

    this.listaLinea = this.datosMaestros.maestroLinea.filter(linea =>
        (linea.EECC !== undefined && linea.EECC['EMail'] === currentUserEmail) || (linea.LAB !== undefined && linea.LAB['EMail'] === currentUserEmail) || (linea.RDM !== undefined && linea.RDM['EMail'] === currentUserEmail) || (linea.DT !== undefined && linea.DT['EMail'] === currentUserEmail)
    );

    // console.log(this.listaLinea);
    // this.listaLinea = this.datosMaestros.maestroLinea;
  }

  cargaListaProveedorSAP( idLinea: number ) {
    const linea = this.datosMaestros.maestroLinea.filter(linea => linea.Id === idLinea)[0];

    if (linea) {
      this.listaProveedorSAP = this.datosMaestros.maestroPrveedor.filter((item: any) => item.Linea === linea.Title);
    } else {
      this.listaProveedorSAP = []
    }

    console.log(this.form.controls.IdProveedorSAP.value);

    if (this.renderizar) {
      this.form.controls.IdProveedorSAP.setValue(-1);
    }
  }

	cargaListeners() {

    const camposDecimals = this.camposEstructura.filter( campo => this.camposEnable[campo.Title] !== undefined && campo['TypeAsString'] === 'Number' && campo['DisplayFormat'] !== undefined );
    // console.log(camposDecimals);
    camposDecimals.forEach(
      campo => {
        const control: AbstractControl = this.form.controls[campo['Title']];
        control.valueChanges.subscribe( (value: number) => this.masterService.maskDecimal( control, campo['DisplayFormat'] ) );
      }
    );

    // Listas con Dependencias
    this.form.controls['IdJerarquiProducto1'].valueChanges.subscribe(
      (value: number) => this.cargaListaJerarquiaProducto2( value )
    );

    this.form.controls['IdJerarquiProducto2'].valueChanges.subscribe(
      (value: number) => this.cargaListaJerarquiaProducto3( value )
    );

    this.form.controls['IdJerarquiProducto3'].valueChanges.subscribe(
      (value: number) => this.cargaListaJerarquiaProducto4( value )
    );

    this.form.controls['IdJerarquiProducto4'].valueChanges.subscribe(
      (value: number) => this.cargaListaJerarquiaProducto5( value )
    );

    this.form.controls['IdCT1'].valueChanges.subscribe(
      ( value: number ) => this.cargaListaCT2( value )
    );

    this.form.controls['IdCT2'].valueChanges.subscribe(
      ( value: number ) => this.cargaListaCT3( value )
    );

    this.form.controls['IdCT3'].valueChanges.subscribe(
      ( value: number ) => this.cargaListaCT4( value )
    );

    this.form.controls['IdGrupoArticulo'].valueChanges.subscribe(
      ( value: number ) => this.cargaListaProveedorSAP( value )
    );

    //Filters

    this.form.controls['formaFarmaceuticaFilter'].valueChanges.subscribe(
      (value: string) => this.filterFormaFarmaceutica( value )
    );

    this.form.controls['tipoMaterialFilter'].valueChanges.subscribe(
      (value: string) => this.filterTipoMaterial( value )
    );

    this.form.controls['grupoArticuloFilter'].valueChanges.subscribe(
      (value: string) => this.filterGrupoArticulo( value )
    );

    this.form.controls['grupoCompraFilter'].valueChanges.subscribe(
      (value: string) => this.filterGrupoCompra( value )
    );

    this.form.controls['condicionAlmacenajeFilter'].valueChanges.subscribe(
      (value: string) => this.filterCondicionAlmacenaje( value )
    );

    this.form.controls['jerarquiaProducto2Filter'].valueChanges.subscribe(
      (value: string) => this.filterJerarquiaProducto2( value )
    );

    this.form.controls['jerarquiaProducto3Filter'].valueChanges.subscribe(
      (value: string) => this.filterJerarquiaProducto3( value )
    );

    this.form.controls['jerarquiaProducto4Filter'].valueChanges.subscribe(
      (value: string) => this.filterJerarquiaProducto4( value )
    );

    this.form.controls['jerarquiaProducto5Filter'].valueChanges.subscribe(
      (value: string) => this.filterJerarquiaProducto5( value )
    );

    this.form.controls['grupoImputacionMaterialFilter'].valueChanges.subscribe(
      (value: string) => this.filterGrupoImputacionMaterial( value )
    );

    // Cálculos
    this.form.controls.ValorCompraQS.valueChanges.subscribe(
      (value: number) => this.calculaMargenTeorico()
    );

    this.form.controls.ValorVentaQS.valueChanges.subscribe(
      (value: number) => this.calculaMargenTeorico()
    );

    // Pruebas

    this.form.controls.IdCanalDistribucion.valueChanges.subscribe(
      (value: any) => console.log(value)
    );
  }

  calculaMargenTeorico(): void {
    // console.log({calculaMargenTeorico: true});
    this.form.controls.MargenTeorico.setValue( (1 - (this.form.controls.ValorCompraQS.value /
      this.form.controls.ValorVentaQS.value)) * 100 );
  }

  filterFormaFarmaceutica( search: string ) {
    if( !this.listaFormaFarmaceutica ) return;

    this.listaFormaFarmaceuticaFilter = new List<MaestroDesplegables>(this.listaFormaFarmaceutica).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterTipoMaterial( search: string ) {
    if( !this.listaTipoMaterial ) return;

    this.listaTipoMaterialFilter = new List<MaestroDesplegables>(this.listaTipoMaterial).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterGrupoArticulo( search: string ) {
    if( !this.listaGrupoArticulo ) return;
    this.listaGrupoArticuloFilter = new List<MaestroDesplegables>(this.listaGrupoArticulo).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterGrupoCompra( search: string ) {
    if( !this.listaGrupoCompra ) return;
    this.listaGrupoCompraFilter = new List<MaestroDesplegables>(this.listaGrupoCompra).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterCondicionAlmacenaje( search: string ) {
    if( !this.listaCondicionAlmacenaje ) return;
    this.listaCondicionAlmacenajeFilter = new List<MaestroDesplegables>(this.listaCondicionAlmacenaje).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterJerarquiaProducto2( search: string ) {
    if( !this.listaJerarquiaProducto2 ) return;
    this.listaJerarquiaProducto2Filter = new List<MaestroDesplegables>(this.listaJerarquiaProducto2).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterJerarquiaProducto3( search: string ) {
    if( !this.listaJerarquiaProducto3 ) return;
    this.listaJerarquiaProducto3Filter = new List<MaestroDesplegables>(this.listaJerarquiaProducto3).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterJerarquiaProducto4( search: string ) {
    if( !this.listaJerarquiaProducto4 ) return;
    this.listaJerarquiaProducto4Filter = new List<MaestroDesplegables>(this.listaJerarquiaProducto4).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterJerarquiaProducto5( search: string ) {
    if( !this.listaJerarquiaProducto5 ) return;
    this.listaJerarquiaProducto5Filter = new List<MaestroDesplegables>(this.listaJerarquiaProducto5).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  filterGrupoImputacionMaterial( search: string ) {
    if( !this.listaGrupoImputacionMaterial ) return;
    this.listaGrupoImputacionMaterialFilter = new List<MaestroDesplegables>(this.listaGrupoImputacionMaterial).Where( x => x.Title.toLowerCase().indexOf( search ) > -1 ).OrderBy( x => x.Title).ToArray();
  }

  obtenerMaestrosYDatos(): Promise<boolean> {
    //debugger;
    const d: Deferred<boolean> = new Deferred<boolean>();

    this.masterService
      .getDatosMaestros()
      .subscribe((masterLogic: MasterLogic) => {
        if (masterLogic.isDatos) {
          // debugger;
          this.datosMaestros = masterLogic;

          d.resolve(true);
        }
      });

    return d.promise;
  }

  public irPaginaExterna(
    nombrePagina: string,
    parametroQueryString: string,
    valorQueryString: string
  ) {
    const url =
      environment.getRutaBaseApp() +
      nombrePagina +
      '?' +
      parametroQueryString +
      '=' +
      valorQueryString;

    window.open(url, '_blank');
  }

  llamarModal() {

    // if (!environment.production) { console.log(this.form); }

    if (this.form.invalid) {

      const seccionAlertada = [];

      Object.keys( this.form.value ).forEach(
        key => {
          this.form.controls[key].markAsTouched();

          if (this.form.controls[key].invalid) {
            const seccion = this.datosMaestros.maestroCampos.filter( campo => campo.Title === key)[0].Seccion;
            const seccionElement: MatExpansionPanel = this[`seccion${seccion}`]; //Para no perder el Tipado

            if (!seccionElement.expanded) {
              seccionElement.open();
            }

            if (seccionAlertada.filter(item => item === seccion).length === 0) {
              this.mostrarModalInformativo('', `Falta ingresar información en la Sección ${seccion}`);
              seccionAlertada.push(seccion);
            }
          }

        }
      );

    } else {
      // console.log(this.form.controls['IdGrupoArticulo'].value);
      const IdGrupoArticulo: number = this.form.controls['IdGrupoArticulo'].value;

      const linea = this.listaLinea.filter(
        linea => linea.Id === IdGrupoArticulo
      );

      // console.log(linea);
      let mensaje: string;
      if (this.maestroFlujoEtapaSiguiente.Abreviatura === '' || this.maestroFlujoEtapaSiguiente.Abreviatura === null) { //Etapa Final

        mensaje = '¿Está seguro de dar por Finalizado el Flujo?';

      } else {

        const responsableSiguienteEtapa = linea[0][this.maestroFlujoEtapaSiguiente.Abreviatura]['Title'];

        mensaje = `¿Está seguro de enviar la información al responsable ${responsableSiguienteEtapa} de la etapa ${this.maestroFlujoEtapaSiguiente.Title}?`;

      }

      this.mostrarModalConfirmacion(this, false, mensaje, this.guardar, 'Sí', 'No');
    }
  }

  async guardar( that: FormularioSolicitudComponent, borrador = false, comentarioSE = '' ) {
    that.mostrarProgreso(false);

    that.loadingButtons = true;

    const itemSave = {...that.form.value};

    that.masterService.modObject( itemSave, that.maestroMaterial );
    const maestroFlujoEtapaIdBorrador = that.maestroFlujoEtapaActual.Id;

    if (!borrador) {
      itemSave['MaestroFLujoEtapaId'] = that.maestroFlujoEtapaSiguiente.Id;
    } else {
      itemSave['MaestroFLujoEtapaId'] = that.maestroFlujoEtapaActual.Id;
    }

    if (itemSave['IdCanalDistribucion']) {
      itemSave['IdCanalDistribucion'] = itemSave['IdCanalDistribucion'].join();
    }

    itemSave['EnBorrador'] = borrador;

    const IdGrupoArticulo: number = that.form.controls['IdGrupoArticulo'].value;

    const linea = that.listaLinea.filter( linea => linea.Id === IdGrupoArticulo );

    // console.log({linea});
    const usuarios = [that.datosMaestros.currentUser.Id];

    if (linea.length > 0) {
      if (linea[0].EECC !== undefined) {
        if (that.maestroMaterial.Id === 0) {
          itemSave['EjecutivoComercialId'] = {results: [linea[0].EECC.Id]};
        }
        usuarios.push(linea[0].EECC.Id);
      }

      if (linea[0].LAB !== undefined) {
        if (that.maestroMaterial.Id === 0) {
          itemSave['ResponsableLaboratorioId'] = {results: [linea[0].LAB.Id]};
        }
        usuarios.push(linea[0].LAB.Id);
      }

      if (linea[0].DT !== undefined) {
        if (that.maestroMaterial.Id === 0) {
          itemSave['ResponsableDTId'] = {results: [linea[0].DT.Id]};
        }
        usuarios.push(linea[0].DT.Id);
      }

      if (linea[0].RDM !== undefined) {
        if (that.maestroMaterial.Id === 0) {
          itemSave['ResponsableRDMId'] = {results: [linea[0].RDM.Id]};
        }
        usuarios.push(linea[0].RDM.Id);
      }
    }

    const resp: any = await that.masterService.guardarMaestroMaterial(
      that.maestroMaterial.Id, itemSave, comentarioSE, that.modified, maestroFlujoEtapaIdBorrador, that.maestroMaterialDocs, usuarios
    );

    if (resp === false) {
      that.mostrarModalInformativo( '', 'El Formulario de Solicitud ya ha sido modificado por otro Usuario, por favor recargue la página con F5.' );
    } else {

      if (!borrador) {

        let responsable: any;
        if (that.maestroFlujoEtapaSiguiente.Abreviatura === '' || that.maestroFlujoEtapaSiguiente.Abreviatura === null) { //Etapa Final
          responsable = linea[0][that.maestroFlujoEtapaActual.Abreviatura];
        } else {
          responsable = linea[0][that.maestroFlujoEtapaSiguiente.Abreviatura];
        }

        // Comentado, arriba obtenemos la Solicitud para la validación, reusamos
        const id = that.maestroMaterial.Id > 0 ? that.maestroMaterial.Id : resp.data.Id;
        that.masterService.getMaestroMaterial( id ).then(
          item => {
            const fechaSolicitud = that.masterService.getFechaActualFormato();

            const link = `${environment.getRutaBaseApp()}material-formulario-solicitud/${id}`;

            const objCorreo: IEmailProperties = {
              To: [responsable.EMail],
              Subject: `Solicitud de Materiales N° ${id} - Etapa: ${that.maestroFlujoEtapaActual.Title}`,
              Body: `
                <p style="margin: 0; font-size: 13px;">Estimado ${responsable.Title}</p>
                <br>
                <p style="margin: 0; font-size: 13px;">A través de la presente le informamos que el Usuario ${that.datosMaestros.currentUser.Title} ha registrado la siguiente información en el Formulario de Solicitud de Materiales N° ${id}.</p>
                <br>
                <p style="margin: 0; font-size: 13px;">Para ingresar a la Solicitud, acceda al siguiente <a target="_blanck" href="${link}">Link</a></p>
                <br>
                <p style="margin: 0; font-size: 13px;">Fecha de Solicitud: ${fechaSolicitud}</p>
                <p style="margin: 0; font-size: 13px;">Etapa: ${that.maestroFlujoEtapaActual.Title}</p>
                <p style="margin: 0; font-size: 13px;">LAB: ${item.ResponsableLaboratorio[0].Title}</p>
                <p style="margin: 0; font-size: 13px;">LDN: ${item.EjecutivoComercial[0].Title}</p>
                <p style="margin: 0; font-size: 13px;">DT: ${item.ResponsableDT[0].Title}</p>
                <p style="margin: 0; font-size: 13px;">RDM: ${item.ResponsableRDM[0].Title}</p>
                <p style="margin: 0; font-size: 13px;">Comentarios Adicionales: ${comentarioSE}.</p>
                <br>
                <p style="margin: 0; font-size: 13px;">Atentamente,</p>
                <p style="margin: 0; font-size: 13px;">Sistema de Gestión de Solicitud de Materiales</p>
              `,
              AdditionalHeaders: {
                'content-type': 'text/html'
              }
            };

            that.masterService.enviarCorreo(objCorreo).then(
              resp => {
                // console.log(resp);
                that.router.navigate(['/material-bandeja-solicitud']);
              },
              err => that.guardarLog( err )
            );
          },
          err => that.guardarLog( err )
        );
      } else { // Cuando es Borrador actualizo modified y
        if (that.maestroMaterial.Id > 0) {// Si es una modificacion actualizamos modified
          that.ngOnInit();
        } else {// Si es una nueva solicitud redireccionamos
          this.router.navigate(['/material-formulario-solicitud', resp.data.Id]);
        }
      }

      that.loadingButtons = false;
      that.mostrarModalSuccess('', !borrador ? 'Se grabó satisfactoriamente.' : 'Su registro está parcialmente guardado.', undefined);

      that.ocultarProgreso();

    }

  }

  llamarModalRechazar() {
    this.mostrarModalConfirmacion(this, false, '¿Está seguro de RECHAZAR la Solicitud?', this.rechazar, 'Sí', 'No');
  }

  rechazar(that: FormularioSolicitudComponent, comodin: boolean, comentarioSE: string) {

    that.mostrarProgreso(false);
    that.loadingButtons = true;

    const maestroFlujoEtapaIdRechazo = that.maestroFlujoEtapaActual.Rechazo;
    // console.log({IdRechazo: that.maestroFlujoEtapaActual});

    const itemSave = {
      MaestroFLujoEtapaId: maestroFlujoEtapaIdRechazo,
      EnBorrador: false
    };

    const IdGrupoArticulo: number = that.form.controls['IdGrupoArticulo'].value;

    const linea = that.listaLinea.filter( linea => linea.Id === IdGrupoArticulo );

    const usuarios = [that.datosMaestros.currentUser.Id];
    if (linea.length > 0) {
      if (linea[0].EECC !== undefined) {
        usuarios.push(linea[0].EECC.Id);
      }

      if (linea[0].LAB !== undefined) {
        usuarios.push(linea[0].LAB.Id);
      }

      if (linea[0].DT !== undefined) {
        usuarios.push(linea[0].DT.Id);
      }

      if (linea[0].RDM !== undefined) {
        usuarios.push(linea[0].RDM.Id);
      }
    }

    that.masterService.guardarMaestroMaterial(
      that.maestroMaterial.Id, itemSave, comentarioSE, that.modified, that.maestroFlujoEtapaActual.Id, [], usuarios
    ).then(
      ( resp: any ) => {

        if (resp === false) {
          that.mostrarModalInformativo( '', 'El Formulario de Solicitud ya ha sido modificado por otro Usuario, por favor recargue la página con F5.' );
        } else {

          const id = that.maestroMaterial.Id;
          that.masterService.getMaestroMaterial( id ).then(
            item => {
              const fechaSolicitud = that.masterService.getFechaActualFormato();

              const link = `${environment.getRutaBaseApp()}material-formulario-solicitud/${id}`;

              const responsableRechazo = linea[0][that.datosMaestros.maestroFLujoEtapa.filter(etapa => etapa.Id === maestroFlujoEtapaIdRechazo)[0].Abreviatura];

              const objCorreo: IEmailProperties = {
                To: [responsableRechazo.EMail],
                Subject: `Solicitud de Materiales N° ${id} - Etapa: ${that.maestroFlujoEtapaActual.Title}`,
                Body: `
                  <p style="margin: 0; font-size: 13px;">Estimado ${responsableRechazo.Title}</p>
                  <br>
                  <p style="margin: 0; font-size: 13px;">A través de la presente le informamos que el Usuario ${that.datosMaestros.currentUser.Title} ha rechazado el Formulario de Solicitud de Materiales N° ${id}.</p>
                  <br>
                  <p style="margin: 0; font-size: 13px;">Motivos de Rechazo:</p>
                  <p style="margin: 0; font-size: 13px;">${comentarioSE.replaceAll('\n','<br>')}</p>
                  <br>
                  <p style="margin: 0; font-size: 13px;">Para ingresar a la Solicitud, acceda al siguiente <a target="_blanck" href="${link}">Link</a></p>
                  <br>
                  <p style="margin: 0; font-size: 13px;">Fecha de Solicitud: ${fechaSolicitud}</p>
                  <p style="margin: 0; font-size: 13px;">Etapa: ${that.maestroFlujoEtapaActual.Title}</p>
                  <p style="margin: 0; font-size: 13px;">LAB: ${item.ResponsableLaboratorio[0].Title}</p>
                  <p style="margin: 0; font-size: 13px;">LDN: ${item.EjecutivoComercial[0].Title}</p>
                  <p style="margin: 0; font-size: 13px;">DT: ${item.ResponsableDT[0].Title}</p>
                  <p style="margin: 0; font-size: 13px;">RDM: ${item.ResponsableRDM[0].Title}</p>
                  <br>
                  <p style="margin: 0; font-size: 13px;">Atentamente,</p>
                  <p style="margin: 0; font-size: 13px;">Sistema de Gestión de Solicitud de Materiales</p>
                `,
                AdditionalHeaders: {
                  'content-type': 'text/html'
                }
              };

              that.masterService.enviarCorreo(objCorreo).then(
                resp => {
                  // console.log(resp);
                  that.router.navigate(['/material-bandeja-solicitud']);
                },
                err => that.guardarLog( err )
              );
            },
            err => that.guardarLog( err )
          );

          that.loadingButtons = false;
          that.ocultarProgreso();

          that.router.navigate(['/material-bandeja-solicitud']);
        }
      },
      err => {
        that.loadingButtons = false;
        that.guardarLog( err );
        that.ocultarProgreso();
      }
    );

  }

  mostrarHistorial() {
    const dialogRef = this.dialog.open(HistorialSolicitudComponent, {
      width: '90%',
      maxHeight: (this.screenHeight * .9),
      data: this.maestroMaterial.Id,
    });
  }

  exportarExcel(): void{

    const camposDecimals = this.camposEstructura.filter(
      campo => campo['TypeAsString'] === 'Number' && campo['DisplayFormat'] !== undefined
    );

    const maestroCampos = this.datosMaestros.maestroCampos;
    const headers = {};
    const textosLargos = {};
    const details = {};

    maestroCampos.forEach(
      campo => {
        if (campo.Texto !== null && this.form.controls[campo.Title] !== undefined) {

          let detail = '';
          let format = '';

          if (campo.DesplegableCampo !== '' && campo.DesplegableCampo !== null) { // Desplegable

            if (campo.Title === Variables.columns.IdCanalDistribucion) {
              if (this.form.controls[campo.Title].value.length > 0) {
                this.form.controls[campo.Title].value.forEach(item => {
                  detail += this.datosMaestros.maestroDesplegables.filter(
                    desplegable => desplegable.Id === item
                  )[0].Title + ', ';
                });

                detail = detail.substring(0, detail.length - 2);
              }
            } else {
              if (this.form.controls[campo.Title].value > 0) { // Valida si tiene valor el desplegable
                detail = this.datosMaestros.maestroDesplegables.filter(
                  desplegable => desplegable.Id === this.form.controls[campo.Title].value
                )[0].Title;

              } else {
                detail = '';
              }
            }

          } else if (campo.ListaCampo !== '' && campo.ListaCampo !== null) { // ListaCampo

            const lista = this.datosMaestros[campo.ListaCampo].filter(
              itemLista => itemLista.Id === this.form.controls[campo.Title].value
            )[0];

            if (campo.ListaCampo === 'maestroLinea') {
              detail = `${lista.Title} - ${lista.MaestroProveedor.Title}`;
            } else {
              detail = `${lista.Proveedor} - ${lista.RazonSocial}`;
            }

          } else { // Valor
            const campoDecimal = camposDecimals.filter( item => item.InternalName === campo.Title || item.Title === campo.Title )[0];
            if (campoDecimal) {
              const value = 0;
              format = value.toFixed(campoDecimal['DisplayFormat']);
            }
            detail = this.form.controls[campo.Title].value;
          }

          // headers.push(campo.Texto);
          // details.push(detail);
          headers[campo.Title] = campo.Texto;
          textosLargos[campo.Title] = campo.TextoLargo;
          // details[campo.Title]['value'] = detail;
          // details[campo.Title]['format'] = format;
          details[campo.Title] = {
            value: detail,
            format
          };
        }
      }
    );

    // console.log({headers});
    // console.log({details});

    // const nombreArchivo = `${Funciones.replaceAll( Funciones.dateFormat( new Date() ), '/', '-' )}-${this.maestroMaterial.Id}`;
    const nombreArchivo = `${Funciones.dateFormat( new Date() ).replaceAll( '/', '-')}-${this.maestroMaterial.Id}`;
    this.excelService.excelSolicitud( headers, details, textosLargos, nombreArchivo );
  }

  regresarAdjunto(index: number): void{
    this.maestroMaterialDocs[index].Oculto = false;
  }

  eliminarAdjunto(index: number): void{
    // console.log(index);
    // console.log(this.maestroMaterialDocs);
    if (this.maestroMaterialDocs[index].Id === 0 ) {
      this.files.splice( this.maestroMaterialDocs[index].indexFile );
      this.maestroMaterialDocs.splice(index, 1);
      this.loadTableDocumentosAdjuntos();
    } else {
      this.maestroMaterialDocs[index].Oculto = true;
    }
  }

  loadFiles(files: File[]): void {
    this.files = files;

    this.files.forEach(
      (file, index) => {

        if (this.maestroMaterialDocs.filter( doc => doc.InternalName === file.name ).length === 0) {

          const maestroMaterialDoc = new MaestroMaterialDocs( file, false, file.name, index );
          maestroMaterialDoc.Author.Name = this.datosMaestros.currentUser.Title;

          this.maestroMaterialDocs.push( maestroMaterialDoc );

        }

      }
    );

    this.loadTableDocumentosAdjuntos();
  }

  loadTableDocumentosAdjuntos(): void {
    this.maestroMaterialDocsDS = new MatTableDataSource(this.maestroMaterialDocs);
    this.maestroMaterialDocsDS.paginator = this.paginator;
    this.maestroMaterialDocsDS.sort = this.sort;
  }

  downloadFile(maestroMaterialDoc: MaestroMaterialDocs): void {
    const extension = Funciones.getExtensionOfFileName( maestroMaterialDoc.InternalName );

    if (extension.indexOf('doc') > -1 || extension.indexOf('xls') > -1 || extension.indexOf('ppt') > -1) {
      window.open(maestroMaterialDoc.urlView, '_blank', '', true);
    } else {
      FileSaver.saveAs(maestroMaterialDoc.urlDownload, maestroMaterialDoc.InternalName);
    }

  }

  changeTipoDocumentoAdjunto(select: any, index: number): void {
    console.log(select);
    this.maestroMaterialDocs[index].IdTipoDocumentoAdjunto = select.value;
  }

  soloNumeros(event) {
    return ( event.ctrlKey || event.altKey
      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
      || (95<event.keyCode && event.keyCode<106)
      || (event.keyCode==8) || (event.keyCode==9)
      || (event.keyCode>34 && event.keyCode<40)
      || (event.keyCode==46) );
  }

  format(format: number, controlName: string): void {
    // console.log('formar');
    // console.log(this.form.controls[controlName].value);
    this.form.controls[controlName].setValue(Funciones.format(format, this.form.controls[controlName].value));
  }

}
