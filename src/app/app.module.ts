import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule ,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Component Shared
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { HomeComponent } from './components/home/home.component';
import { BandejaSolicitudComponent } from './components/bandeja-solicitud/bandeja-solicitud.component';
import { FormularioSolicitudComponent } from './components/formulario-solicitud/formulario-solicitud.component';
import { BandejaParametrosComponent } from './components/mantenimiento/bandeja-parametros/bandeja-parametros.component';
import { FormularioParametrosComponent } from './components/mantenimiento/formulario-parametros/formulario-parametros.component';
import { BandejaEtapasComponent } from './components/mantenimiento/bandeja-etapas/bandeja-etapas.component';
import { FormularioEtapasComponent } from './components/mantenimiento/formulario-etapas/formulario-etapas.component';

//Angular Material Components
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { PortalModule } from '@angular/cdk/portal';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';

import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HttpClientModule } from '@angular/common/http'; // <============
import { NgHttpLoaderModule } from 'ng-http-loader'; // <============

import { MatSelectSearchModule } from './mat-select-search/mat-select-search.module';
import { ModalDialog } from './shared/controls/modal/modal.component';
import { BooleanStringPipe } from './shared/pipes/boolean-string.pipe';
import { HistorialSolicitudComponent } from './shared/components/historial-solicitud/historial-solicitud.component';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { BotoneraComponent } from './components/formulario-solicitud/botonera/botonera.component';
import { FileUploadComponent } from './shared/controls/file-upload/file-upload.component';
import { DatePipe } from '@angular/common';

import { ChartsModule } from 'ng2-charts';
import { FormCreditoComponent } from './components/form-credito/form-credito.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormTableComponent } from './components/form-table/form-table.component';
import { MissolicitudespendientesComponent } from './components/bandejas/missolicitudespendientes/missolicitudespendientes.component';
import { SolicitudesComponent } from './components/bandejas/solicitudes/solicitudes.component';

const materialModules = [
  MatSlideToggleModule,
  MatTooltipModule,

  MatDatepickerModule,
  MatNativeDateModule,

  CdkTreeModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTreeModule,
  OverlayModule,
  PortalModule,
  MatDialogModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BandejaSolicitudComponent,
    FormularioSolicitudComponent,
    BandejaParametrosComponent,
    FormularioParametrosComponent,
    BandejaEtapasComponent,
    FormularioEtapasComponent,
    SidebarComponent,
    ModalDialog,
    BooleanStringPipe,
    HistorialSolicitudComponent,
    DateFormatPipe,
    BotoneraComponent,
    FileUploadComponent,
    FormCreditoComponent,
    FormTableComponent,
    MissolicitudespendientesComponent,
    SolicitudesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ...materialModules,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatSelectSearchModule,
    NgHttpLoaderModule.forRoot(),
    ChartsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    ...materialModules,
    HomeComponent,
    BandejaSolicitudComponent,
    FormularioSolicitudComponent,
    BandejaParametrosComponent,
    FormularioParametrosComponent,
    BandejaEtapasComponent,
    FormularioEtapasComponent,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
