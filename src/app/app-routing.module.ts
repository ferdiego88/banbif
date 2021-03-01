import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Variables } from './shared/variables';
import { HomeComponent } from './components/home/home.component';
import { FormCreditoComponent } from './components/form-credito/form-credito.component';
import { MissolicitudespendientesComponent } from './components/bandejas/missolicitudespendientes/missolicitudespendientes.component';
import { ConsultasComponent } from './components/bandejas/consultas/consultas.component';
import { SolicitudesfinalizadasComponent } from './components/bandejas/solicitudesfinalizadas/solicitudesfinalizadas.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BandejatrabajoComponent } from './components/bandejas/bandejatrabajo/bandejatrabajo.component';
import { BandejatrabajogarantiaComponent } from './components/bandejas/bandejatrabajogarantia/bandejatrabajogarantia.component';
import { BandejatrabajoriesgosComponent } from './components/bandejas/bandejatrabajoriesgos/bandejatrabajoriesgos.component';
import { BandejatrabajolegalComponent } from './components/bandejas/bandejatrabajolegal/bandejatrabajolegal.component';
import { BandejatrabajomiviviendaComponent } from './components/bandejas/bandejatrabajomivivienda/bandejatrabajomivivienda.component';
import { BandejatrabajogestorlegalComponent } from './components/bandejas/bandejatrabajogestorlegal/bandejatrabajogestorlegal.component';
import { BandejatrabajogestorComponent } from './components/bandejas/bandejatrabajogestor/bandejatrabajogestor.component';
import { BandejatrabajodesembolsoComponent } from './components/bandejas/bandejatrabajodesembolso/bandejatrabajodesembolso.component';
import { LogseguimientoComponent } from './components/bandejas/logseguimiento/logseguimiento.component';
import { DashboardCreditoComponent } from './components/dashboard/dashboard-credito/dashboard-credito.component';
import { DashboardHipotecarioComponent } from './components/dashboard/dashboard-hipotecario/dashboard-hipotecario.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: Variables.path.home,
    component: WelcomeComponent,
    // loadChildren: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  { path: Variables.path.formCreditoDetalle, component: FormCreditoComponent },
  { path: Variables.path.formCredito, component: FormCreditoComponent },
  { path: Variables.path.bandejaMisSolicitudesPendientes, component: MissolicitudespendientesComponent },
  { path: Variables.path.bandejaConsultas, component: ConsultasComponent },
  { path: Variables.path.bandejaSolicitudesFinalizadas, component: SolicitudesfinalizadasComponent },
  { path: Variables.path.bandejaTrabajo, component: BandejatrabajoComponent },
  { path: Variables.path.bandejaTrabajoGarantia, component: BandejatrabajogarantiaComponent },
  { path: Variables.path.bandejaTrabajoRiesgos, component: BandejatrabajoriesgosComponent },
  { path: Variables.path.bandejaTrabajoLegal, component: BandejatrabajolegalComponent },
  { path: Variables.path.bandejaTrabajoMiVivienda, component: BandejatrabajomiviviendaComponent },
  { path: Variables.path.bandejaTrabajoGestor, component: BandejatrabajogestorComponent },
  { path: Variables.path.bandejaTrabajoGestorLegal, component: BandejatrabajogestorlegalComponent },
  { path: Variables.path.bandejaSeguimientoSolicitudes, component: LogseguimientoComponent },
  { path: Variables.path.bandejaTrabajoDesembolso, component: BandejatrabajodesembolsoComponent}, 
  { path: Variables.path.dashboardSolicitudesCreditoHipotecario, component: DashboardCreditoComponent },
  { path: Variables.path.dashboardHipotecario, component: DashboardHipotecarioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
