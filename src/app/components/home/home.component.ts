import { Component, OnInit, ApplicationRef, NgZone, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SpinnerVisibilityService } from 'ng-http-loader';

import { Deferred } from 'ts-deferred';

import { environment } from '../../../environments/environment';

import { FormularioAT } from '../../shared/pages/formularioAT';

import { IStatistics } from '../../shared/models/fisics/IStatistics';
import { MasterLogic } from '../../shared/models/logics/MasterLogic';


import { MasterService } from '../../shared/services/master.service';
import { MaestroFLujoEtapa } from '../../shared/models/fisics/MaestroFLujoEtapa';
import { MaestroMaterialService } from '../../shared/services/maestromaterial.service';
import { MaestroMaterialFilter } from 'src/app/shared/models/fisics/MaestroMaterialFilter';
import { PagedItemCollection, Item } from '@pnp/sp/items';
import { MaestroMaterial } from '../../shared/models/fisics/MaestroMaterial';
import { Variables } from '../../shared/variables';
import { Funciones } from '../../shared/funciones';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { FormControl } from '@angular/forms';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends FormularioAT implements OnInit {
  esMiembroId: boolean;
  currentUserName: string = '';
  currentUserPictureUrl = '';
  currentUserEmail = '';
  statistics: IStatistics;
  solicitudesEnProceso: number;
  solicitudesEnPendientes: number;
  solicitudesCerradas: number;
  solicitudesVencidas: number;
  nuevaSolicitud: boolean;

  barChartOptions: ChartOptions = {
    responsive: true,
  };

  pieChartOptions: ChartOptions = {
    responsive: true,
    // plugins: {
    //   datalabels: {
    //     formatter: (value, ctx) => {
    //       const label = ctx.chart.data.labels[ctx.dataIndex];
    //       console.log(value);
    //       console.log(label);
    //       return label.toString().replace(value, '').trim();
    //     },
    //   },
    // }
  };
  pieChartPlugins = [/*pluginDataLabels*/];

  pieChartLabel: Label[];
  pieChartData: SingleDataSet;
  pieChartColors: Color[] = [
    {
      backgroundColor: [/*Variables.colores.Flujo.Creadas, */Variables.colores.Flujo.EnProceso, Variables.colores.Flujo.Cerradas],
      hoverBackgroundColor: [/*Variables.colores.Flujo.Creadas, */Variables.colores.Flujo.EnProceso, Variables.colores.Flujo.Cerradas],
    }
  ];

  barChartLabels: Label[];
  barChartLabelsPorMes: Label[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  barChartDataPorMes: ChartDataSets[];

  maestroMaterial: MaestroMaterial[];
  formControlAnnio: FormControl;
  anniosSelect: number[];

  screenWidth: any;

  constructor(
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public masterService: MasterService,
    public zone: NgZone,
    public _spinner: SpinnerVisibilityService,
    private maestroMaterialService: MaestroMaterialService
  ) {
    super('Home', applicationRef, dialog, route, router, masterService, zone, _spinner);

    this.esMiembroId = false;

    this.formControlAnnio = new FormControl(0);
    this.formControlAnnio.valueChanges.subscribe(value => this.cargaEstadisticaPorMes((+value)));
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?): void {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    // this.cargarDatosPagina();
    this.masterService.test().then(resp => console.log(resp));
  }

  cargarDatosPagina() {
    this.mostrarProgreso();
    this.statistics = <IStatistics>{};
    this.obtenerMaestrosYDatos().then(
      () => {
        // console.log('log');

        this.currentUserName = this.datosMaestros.currentUser.Title;
        this.currentUserPictureUrl = "assets/img/faces/userprofile.png"; //this.datosMaestros.currentUser.PictureUrl;
        this.currentUserEmail = this.datosMaestros.currentUser.Email;

        this.maestroMaterialService.getSolicitudMateriales(null, '', true, 100000, this.datosMaestros.currentUser).then(
          (data: PagedItemCollection<any[]>) => {
            console.log(data);
            const maestroMaterial: MaestroMaterial[] = data.results.map(elemento => {
              return MaestroMaterial.parseJson(elemento);
            });

            const fechaActual = new Date();

            const maestroMaterialProceso: MaestroMaterial[] = [];
            const maestroMaterialPendientes: MaestroMaterial[] = [];
            const maestroMaterialCerradas: MaestroMaterial[] = [];
            const maestroMaterialVencidas: MaestroMaterial[] = [];

            maestroMaterial.forEach(
              (maestroMaterialF: MaestroMaterial) => {

                if (maestroMaterialF['MaestroFLujoEtapa'].Id === Variables.constantes.IdEtapaFinal) { // Validacion Cerradas

                  const responsables = [
                    maestroMaterialF['EjecutivoComercial'], maestroMaterialF['ResponsableLaboratorio'], maestroMaterialF['ResponsableDT'],
                    maestroMaterialF['ResponsableRDM']
                  ];

                  if (responsables.includes(this.currentUserName)) {
                    maestroMaterialCerradas.push(maestroMaterialF);
                  }

                } else { // Validacion Vencidas, Proceso y Pendientes

                  let fechaSolicitud = maestroMaterialF.Modified ? maestroMaterialF.Modified : maestroMaterialF.Created;
                  fechaSolicitud = new Date(fechaSolicitud);

                  fechaSolicitud = new Date(
                    fechaSolicitud.getFullYear(),
                    fechaSolicitud.getMonth(),
                    (fechaSolicitud.getDate() + Variables.constantes.PlazoDiasVencimientoSolicitud)
                  );

                  if (fechaSolicitud < fechaActual) { // Vencidas
                    maestroMaterialVencidas.push(maestroMaterialF);
                  } else { // Proceso y Pendientes

                    let campoResponsable: string;

                    switch (maestroMaterialF['MaestroFLujoEtapa'].Abreviatura) {
                      case 'EECC':
                        campoResponsable = 'EjecutivoComercial';
                        break;

                      case 'LAB':
                        campoResponsable = 'ResponsableLaboratorio';
                        break;

                      case 'DT':
                        campoResponsable = 'ResponsableDT';
                        break;

                      case 'RDM':
                        campoResponsable = 'ResponsableRDM';
                        break;
                    }

                    if (this.currentUserName === maestroMaterialF[campoResponsable]) {
                      maestroMaterialPendientes.push(maestroMaterialF);
                    } else {
                      maestroMaterialProceso.push(maestroMaterialF);
                    }
                  }
                }

              }
            );

            this.solicitudesEnProceso = maestroMaterialProceso.length;
            this.solicitudesEnPendientes = maestroMaterialPendientes.length;
            this.solicitudesCerradas = maestroMaterialCerradas.length;
            this.solicitudesVencidas = maestroMaterialVencidas.length;

            this.nuevaSolicitud = Funciones.validaNuevaSolicitud(this.datosMaestros.maestroLinea, this.datosMaestros.currentUser.Id);

            this.validaUserAdministrator();

            this.cargaEstadistica();
          },
          err => this.guardarLog(err)
        );

        this.ocultarProgreso();
      },
      err => this.guardarLog(err)
    );
  }

  cargaEstadistica() {
    // if (this.userAdministrator) {

      const AnnioActual = (new Date()).getFullYear();
      console.log(AnnioActual);

      this.barChartLabels = [];
      this.anniosSelect = [];

      // this.barChartLabels.push('');

      for (let annio = Variables.constantes.AnnioInicial; annio <= AnnioActual; annio++) {
        this.anniosSelect.push(annio);
        this.barChartLabels.push(annio.toString());
      }

      this.maestroMaterialService.getSolicitudMateriales(null, '', true, 100000, this.datosMaestros.currentUser, this.userAdministrator).then(
        (data: PagedItemCollection<any[]>) => {
          console.log({ data });
          this.maestroMaterial = data.results.map(elemento => {
            const parse = MaestroMaterial.parseJson(elemento);
            const fecha = parse.Created.toString();
            parse.Created = new Date(`${fecha.substring(3, 5)}-${fecha.left(2)}-${fecha.right(4)}`);
            return parse;
          });

          console.log(this.maestroMaterial);

          // const solicitudesCreadasPorAnnio: ChartDataSets = {
          //   data: [],
          //   label: 'Creadas',
          //   backgroundColor: Variables.colores.Flujo.Creadas,
          //   hoverBackgroundColor: Variables.colores.Flujo.Creadas,
          //   borderColor: Variables.colores.Flujo.Creadas,
          // };

          const solicitudesEnProcesoPorAnnio: ChartDataSets = {
            data: [],
            label: 'En Proceso',
            backgroundColor: Variables.colores.Flujo.EnProceso,
            hoverBackgroundColor: Variables.colores.Flujo.EnProceso,
            borderColor: Variables.colores.Flujo.EnProceso,
          };

          const solicitudesAtendidasPorAnnio: ChartDataSets = {
            data: [],
            label: 'Cerradas',
            backgroundColor: Variables.colores.Flujo.Cerradas,
            hoverBackgroundColor: Variables.colores.Flujo.Cerradas,
            borderColor: Variables.colores.Flujo.Cerradas,
          };

          this.barChartLabels.forEach(annio => {
            if (annio.toString() !== '') {
              const maestroMaterialPorAnnio = this.maestroMaterial.filter(item => item.Created.getFullYear() === (+annio));
              // solicitudesCreadasPorAnnio.data.push(maestroMaterialPorAnnio.length);
              solicitudesAtendidasPorAnnio.data.push(
                maestroMaterialPorAnnio.filter(item => item['MaestroFLujoEtapa'].Id === Variables.constantes.IdEtapaFinal).length
              );

              solicitudesEnProcesoPorAnnio.data.push(
                maestroMaterialPorAnnio.filter(item => item['MaestroFLujoEtapa'].Id !== Variables.constantes.IdEtapaFinal).length
              );
            }
            // else {
            //   solicitudesCreadasPorAnnio.data.push(0);
            //   solicitudesAtendidasPorAnnio.data.push(0);
            // }

          });

          this.barChartData = [];
          this.barChartData.push(...[/*solicitudesCreadasPorAnnio, */solicitudesEnProcesoPorAnnio, solicitudesAtendidasPorAnnio]);

          this.formControlAnnio.setValue(AnnioActual);
          console.log(this.barChartLabels);
          console.log(this.barChartData);
        },
        err => this.guardarLog(err)
      );
    // }
  }

  cargaEstadisticaPorMes(annio: number) {
    console.log(this.pieChartLabel);

    this.pieChartData = [];

    const maestroMaterialPorAnnio = this.maestroMaterial.filter(item => item.Created.getFullYear() === (+annio));

    // this.pieChartData.push(maestroMaterialPorAnnio.length);
    const maestroMaterialPorAnnioEnProceso = maestroMaterialPorAnnio.filter(item => item['MaestroFLujoEtapa'].Id !== Variables.constantes.IdEtapaFinal).length;
    this.pieChartData.push(maestroMaterialPorAnnioEnProceso);

    const maestroMaterialPorAnnioCerradas = maestroMaterialPorAnnio.filter(item => item['MaestroFLujoEtapa'].Id === Variables.constantes.IdEtapaFinal).length;
    this.pieChartData.push(maestroMaterialPorAnnioCerradas);

    this.pieChartLabel = [
      // `Creadas ${maestroMaterialPorAnnio.length}`,
      `En Proceso ${maestroMaterialPorAnnioEnProceso}`,
      `Cerradas ${maestroMaterialPorAnnioCerradas}`
    ];

    console.log(this.pieChartData);

    this.barChartLabelsPorMes = [];

    this.barChartLabelsPorMes;

    // const solicitudesCreadasPorMes: ChartDataSets = {
    //   data: [],
    //   label: 'Creadas',
    //   backgroundColor: Variables.colores.Flujo.Creadas,
    //   hoverBackgroundColor: Variables.colores.Flujo.Creadas,
    //   borderColor: Variables.colores.Flujo.Creadas,
    // };

    const solicitudesEnProcesoPorMes: ChartDataSets = {
      data: [],
      label: 'En Proceso',
      backgroundColor: Variables.colores.Flujo.EnProceso,
      hoverBackgroundColor: Variables.colores.Flujo.EnProceso,
      borderColor: Variables.colores.Flujo.EnProceso,
    };

    const solicitudesAtendidasPorMes: ChartDataSets = {
      data: [],
      label: 'Cerradas',
      backgroundColor: Variables.colores.Flujo.Cerradas,
      hoverBackgroundColor: Variables.colores.Flujo.Cerradas,
      borderColor: Variables.colores.Flujo.Cerradas,
    };

    for (let month = 1; month <= 12; month++) {

      this.barChartLabelsPorMes.push(Funciones.getMonth(month));
      const maestroMaterialPorAnnioYMes = this.maestroMaterial.filter(item => item.Created.getFullYear() === (+annio) && item.Created.getMonth() === month);

      // solicitudesCreadasPorMes.data.push(maestroMaterialPorAnnioYMes.length);
      solicitudesAtendidasPorMes.data.push(
        maestroMaterialPorAnnioYMes.filter(item => item['MaestroFLujoEtapa'].Id === Variables.constantes.IdEtapaFinal).length
      );

      solicitudesEnProcesoPorMes.data.push(
        maestroMaterialPorAnnioYMes.filter(item => item['MaestroFLujoEtapa'].Id !== Variables.constantes.IdEtapaFinal).length
      );
    }

    this.barChartDataPorMes = [];
    this.barChartDataPorMes.push(...[
      // solicitudesCreadasPorMes,
      solicitudesEnProcesoPorMes, solicitudesAtendidasPorMes
    ]);

    console.log(this.barChartLabelsPorMes);
    console.log(this.barChartDataPorMes);

  }

  obtenerMaestrosYDatos(): Promise<boolean> {
    //debugger;
    const d: Deferred<boolean> = new Deferred<boolean>();

    this.masterService
      .getDatosMaestros()
      .subscribe((masterLogic: MasterLogic) => {
        if (masterLogic.isDatos) {
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
      // environment.getRutaBaseApp() +
      nombrePagina;// +
    //'?' +
    //parametroQueryString +
    //'=' +
    //valorQueryString;

    //window.open(url, '_blank');
    this.router.navigate([url])
  }

}
