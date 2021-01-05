import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Variables } from './shared/variables';
import { HomeComponent } from './components/home/home.component';
// import { BandejaSolicitudComponent } from './components/bandeja-solicitud/bandeja-solicitud.component';
// import { FormularioSolicitudComponent } from './components/formulario-solicitud/formulario-solicitud.component';
// import { BandejaParametrosComponent } from './components/mantenimiento/bandeja-parametros/bandeja-parametros.component';
// import { FormularioParametrosComponent } from './components/mantenimiento/formulario-parametros/formulario-parametros.component';
// import { BandejaEtapasComponent } from './components/mantenimiento/bandeja-etapas/bandeja-etapas.component';
// import { FormularioEtapasComponent } from './components/mantenimiento/formulario-etapas/formulario-etapas.component';
import { FormCreditoComponent } from './components/form-credito/form-credito.component';
import { MissolicitudespendientesComponent } from './components/bandejas/missolicitudespendientes/missolicitudespendientes.component';
import { SolicitudesComponent } from './components/bandejas/solicitudes/solicitudes.component';
import { SolicitudesfinalizadasComponent } from './components/bandejas/solicitudesfinalizadas/solicitudesfinalizadas.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SolicitudespendientesComponent } from './components/bandejas/solicitudespendientes/solicitudespendientes.component';
import { SolicitudesenevaluacionComponent } from './components/bandejas/solicitudesenevaluacion/solicitudesenevaluacion.component';
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
  { path: Variables.path.bandejaSolicitudes, component: SolicitudesComponent },
  { path: Variables.path.bandejaSolicitudesFinalizadas, component: SolicitudesfinalizadasComponent },
  { path: Variables.path.bandejaSolicitudesPendientes, component: SolicitudespendientesComponent },
  { path: Variables.path.bandejaSolicitudesEvaluacion, component: SolicitudesenevaluacionComponent },
  { path: Variables.path.bandejaSeguimientoSolicitudes, component: LogseguimientoComponent },
  { path: Variables.path.dashboardSolicitudesCreditoHipotecario, component: DashboardCreditoComponent },
  { path: Variables.path.dashboardHipotecario, component: DashboardHipotecarioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
