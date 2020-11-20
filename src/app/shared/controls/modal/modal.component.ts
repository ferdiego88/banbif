import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModalType } from '../../models/fisics/State';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export interface IDialogData {
  mensaje: string;
  tipoModal: ModalType;
  titulo: string;
  textoBotonNo?: string;
  textoBotonSi?: string;
  textoComentarios?: boolean;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalDialog implements OnInit {

  comentarios = '';
  // controlComentarios: FormControl;

  ngOnInit(): void {}

  constructor(
    public dialogRef: MatDialogRef<ModalDialog>,
    @Inject(MAT_DIALOG_DATA) public datos: IDialogData
  ) {
    console.log(this.datos);
    // this.controlComentarios = new FormControl('', Validators.required);

    // this.controlComentarios.valueChanges.subscribe(
    //   value => value.
    // )
  }

  /*onNoClick(): void {
    this.dialogRef.close();
  }*/

  confirmar() {

    // if (this.datos.textoComentarios && this.controlComentarios.value === '') {
    if (this.datos.textoComentarios) {
      let grabar = true;

      if (this.datos.mensaje.indexOf('RECHAZAR') > 0) {
        if (this.comentarios === '') {
          grabar = false;
          Swal.fire('Alerta', 'Los Comentarios son obligatorios al Rechazar.','warning');
        }
      }

      if (grabar) {
        this.dialogRef.close( {close: true, comentarios: this.comentarios} );
      }

      console.log(this.comentarios);
      console.log(this.comentarios.indexOf('\n'));

    } else {
      this.dialogRef.close( {close: true} );
    }
    
  }
}
