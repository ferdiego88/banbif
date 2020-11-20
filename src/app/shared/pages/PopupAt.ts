import { Component, OnInit, Inject } from '@angular/core';
import {
  ModalDialog,
  IDialogData,
} from 'src/app/shared/controls/modal/modal.component';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ModalType } from '../models/fisics/State';
import { Log } from '../models/fisics/Log';
//import * as $ from 'jquery';
declare var $:any;
export class PopupAt {
  submitted: boolean;
  form: FormGroup;
  nombrePagina: string;

  constructor(
    public pagina: string,
    public dialog: MatDialog,
    //public spinner: NgxSpinnerService,
    // public masterService: MasterService,
    public dialogRef: MatDialogRef<ModalDialog>,
    public formBuilder: FormBuilder
  ) {
    this.nombrePagina = pagina;
  }

  getErrorRequerido(nombreControl: string): string {
    const control = this.form.controls[nombreControl];
    if (
      !control.valid &&
      (this.submitted || control.dirty || control.touched)
    ) {
      return "<span class='form-message'>Este campo es obligatorio.</span>";
    }
    return '';
  }

  getErrorPeoplePicker(nombreControl: string) {
    const control = this.form.controls[nombreControl];
    const usuarios = control.value;

    if (
      usuarios.length == 0 &&
      (this.submitted || control.dirty || control.touched)
    ) {
      $('.people-chip-document-owner').addClass('mat-form-field-invalid');
      return "<span class='form-message'>Este campo es obligatorio.</span>";
    } else {
      $('.people-chip-document-owner').removeClass('mat-form-field-invalid');
    }
    return '';
  }

  mostrarProgreso() {
    //this.spinner.show();
  }

  ocultarProgreso() {
    //this.spinner.hide();
  }

  mostrarModalSuccess(
    titulo: string,
    mensaje: string,
    callback: any,
    textoBotonSi?
  ): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = titulo;
    dialogData.tipoModal = ModalType.Success;
    dialogData.textoBotonSi = textoBotonSi;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: '560px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (callback) {
        callback(result);
      }
    });
  }

  mostrarModalConfirmacion(
    mensaje: string,
    callback: any,
    textoBotonSi?: string,
    textoBotonNo?: string
  ): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = '';
    dialogData.tipoModal = ModalType.Confirm;
    dialogData.textoBotonSi = textoBotonSi;
    dialogData.textoBotonNo = textoBotonNo;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: '560px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (callback) {
        callback(result);
      }
    });
  }

  mostrarModalError(mensaje: string, error: any, callback?: any): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = '¡Hubo un error!';
    dialogData.titulo = '';
    dialogData.tipoModal = ModalType.Error;

    // this.masterService.guardarLog(Log.setNuevoElemento(this.nombrePagina, mensaje, error));

    const dialogRef = this.dialog.open(ModalDialog, {
      width: '560px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (callback) {
        callback(result);
      }
    });
  }

  mostrarModalInformativo(titulo: string, mensaje: string): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = titulo;
    dialogData.tipoModal = ModalType.Warning;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: '560px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
