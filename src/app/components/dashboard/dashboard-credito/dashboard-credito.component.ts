import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { FormularioBase } from 'src/app/shared/pages/formularioBase';
import { GeneralListService } from 'src/app/shared/services/general-list.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { SolicitudesService } from 'src/app/shared/services/solicitudes.service';

@Component({
  selector: 'app-dashboard-credito',
  templateUrl: './dashboard-credito.component.html',
  styleUrls: ['./dashboard-credito.component.scss']
})
export class DashboardCreditoComponent extends FormularioBase implements OnInit {

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

  ngOnInit(): void {
  }

}
