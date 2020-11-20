import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Variables } from '../../variables';
import { MaestroMaterialFlujoLog } from '../../models/fisics/MaestroMaterialFlujoLog';
import { MaestromaterialflujologService } from '../../services/maestromaterialflujolog.service';

import { SpinnerVisibilityService } from 'ng-http-loader';
import { Log } from '../../models/fisics/Log';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-historial-solicitud',
  templateUrl: './historial-solicitud.component.html',
  styleUrls: ['./historial-solicitud.component.scss']
})
export class HistorialSolicitudComponent implements OnInit {
  
  loading: boolean;

  dataSourceHistorial: MatTableDataSource<MaestroMaterialFlujoLog>;
  displayedColumnsProjects: string[] = [
    Variables.columns.Creado,
    Variables.columns.CreadoPor,
    Variables.columns.MaestroFLujoEtapa,   
    Variables.columns.Comentarios,
    Variables.columns.EnBorrador
  ];
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(    
    public dialogRef: MatDialogRef<HistorialSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private maestroMaterialFlujoLogService: MaestromaterialflujologService,
    private spinner: SpinnerVisibilityService,
    private masterService: MasterService
  ) {
  }

  ngOnInit(): void {    
    this.getMaestroMaterialFlujoLog();
  }

  getMaestroMaterialFlujoLog(): void {
    this.load(true);

    this.maestroMaterialFlujoLogService.getItemsByMaestroMaterialId( this.data ).then(
      (data: any) => {
        this.dataSourceHistorial = new MatTableDataSource(data);
        this.dataSourceHistorial.paginator = this.paginator;
        this.dataSourceHistorial.sort = this.sort;
        this.load(false);
      },
      err => this.guardarLog( err )
    );

  }

  load(load: boolean): void {
        
    if (load) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
    
    this.loading = load;

  }

  guardarLog(err: any): void {
    const log = Log.setNuevoElemento( document.location.href, 'Historial de Solicitud', err);
    // console.log(log);
    this.masterService.guardarLog( log ).then();
  }

}
