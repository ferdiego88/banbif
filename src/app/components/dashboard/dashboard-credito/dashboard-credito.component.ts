import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SolicitudCreditoHipotecario, TipoProductoModel, ZonaModel } from 'src/app/shared/models/fisics';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';
import { GeneralListService } from 'src/app/shared/services/general-list.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes.service';
import { Variables } from 'src/app/shared/variables';

@Component({
  selector: 'app-dashboard-credito',
  templateUrl: './dashboard-credito.component.html',
  styleUrls: ['./dashboard-credito.component.scss']
})
export class DashboardCreditoComponent extends FormularioBase implements OnInit {

  zonaModelList: ZonaModel [];
  oficinaList: TipoProductoModel [];
  estadoList: TipoProductoModel [];
  tipoProductoList: TipoProductoModel [];
  estadoCreaList: TipoProductoModel [];
  solicitudHipotecarioList: SolicitudCreditoHipotecario [];
  cuentaCreaCPM = 0;
  dashboardForm = this.fb.group({
    ZonaId : [null],
    OficinaId : [null],
    Vendedor : [null],
    Canal : [null],
    Origen : [null],
    Indicador : [null],
    Responsable : [null],
    Semaforo : [null],
    Variacion : [null],
    Tipo_ProductoId : [null],
    EstadoId : [null]
  });

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
    super('Dashboard de Solicitudes de Credito', applicationRef, dialog, route, router, masterService, zone, spinner);
   }

  ngOnInit(){
    this.cargarCombos();
  }

  cargarCombos(){
    this.getZona();
    this.getEstado();
    this.valueOficina();
    this.getTipoProducto();
    this.getCountSolicitudes();
     // this.getSolicitudesCredito();
  }

  getZona(){
    this.generalListService.get(Variables.listas.AdmZona)
      .then(zonaModelList => this.zonaModelList = zonaModelList)
      .catch(error => console.error(error));
  }
  valueOficina(): any{
    this.dashboardForm.get('ZonaId').valueChanges.subscribe(selectedValue => {
      this.oficinaList = [];
      this.generalListService.getByField(Variables.listas.AdmOficina, Variables.listas.AdmZonaId, selectedValue)
        .then((oficinaList: any) => this.oficinaList = oficinaList)
        .catch(error => console.error(error));
    });
  }
  getTipoProducto(){
    this.generalListService.get(Variables.listas.AdmTipoProducto, 'Title')
    .then(tipoProductoList => this.tipoProductoList = tipoProductoList)
    .catch(error => console.error(error));
  }

  getSolicitudesCredito(){
    this.generalListService.get(Variables.listas.AdmSolicitudCreditoHipotecario)
    .then(solicitudHipotecarioList => this.solicitudHipotecarioList = solicitudHipotecarioList)
    .catch(error => console.error(error));
    return this.solicitudHipotecarioList;
  }

  getCountSolicitudes(){
    this.generalListService.getByField(Variables.listas.AdmSolicitudCreditoHipotecario, Variables.listas.AdmEstado,  1)
      .then((estadoCreaList: any) => {this.estadoCreaList = estadoCreaList; this.cuentaCreaCPM = this.estadoCreaList.length; })
      .catch(error => console.error(error));
  }
  getEstado(){
    this.generalListService.get(Variables.listas.AdmEstado)
    .then(estadoList => this.estadoList = estadoList)
    .catch(error => console.error(error));
  }

}
