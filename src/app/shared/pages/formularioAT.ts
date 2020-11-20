import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialog, IDialogData } from '../controls/modal/modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalType, MailTemplateType, State } from '../models/fisics/State';
import { Log } from '../models/fisics/Log';
import { Configuration } from '../models/fisics/Configuration';
//import * as $ from 'jquery';
import { Deferred } from 'ts-deferred';
import { User } from '../models/fisics/base/User';
import { MailTemplate } from '../models/fisics/MailTemplate';
import { Lookup } from '../models/fisics/base/Lookup';
import { Variables } from '../variables';
import { Group } from '../models/fisics/base/Group';
import { environment } from '../../../environments/environment.prod';
import { ApplicationRef, NgZone } from '@angular/core';
import { MasterLogic } from '../models/logics/MasterLogic';
import { MasterService } from '../services/master.service';
import { FormBuilder } from '@angular/forms';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { MaestroDesplegables } from '../models/fisics/MaestroDesplegables';
import { List } from "linqts";
declare var $:any;

export class FormularioAT {
  datosMaestros: MasterLogic;
  nombrePagina: string;
  form: FormGroup;
  submitted: boolean;
  spinner: SpinnerVisibilityService;
  loading = false;
  loadingButtons = false;
  
  userAdministrator = false;
  //variables: Variables
  constructor(
    nombrePagina: string,
    public applicationRef: ApplicationRef,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public masterService: MasterService,
    public zone: NgZone,
    public _spinner: SpinnerVisibilityService
  ) {
    this.spinner = _spinner;
    //this.spinner.show();
    this.nombrePagina = nombrePagina;
    this.submitted = false;
    this.mostrarHeaderWeb();
    this.fixBotonAtrasNavegador(applicationRef, router, zone);    
   // this.spinner = _spinner;
  }

  validaUserAdministrator() {
    const groupUserAdministrator = this.datosMaestros.currentUser.Groups.filter(group => group.Title === Variables.Grupos.Administradores);
    this.userAdministrator = (groupUserAdministrator && groupUserAdministrator.length > 0);
  }

  obtenerListaDesplegablesPorTipo(tipo:string): MaestroDesplegables[]{
    //debugger;
    //let listaDesplegables: MaestroDesplegables[];
    /*if(this.datosMaestros != null){
    listaDesplegables = this.datosMaestros.maestroDesplegables.filter(word => word.TipoText == tipo);
    }*/


   // let evaluaciones = new List<MaestroDesplegables>(listaDesplegables).OrderBy(x => x.Title).ToArray()

    let listaDesplegables = [];
    if(this.datosMaestros != null){
      listaDesplegables = new List<MaestroDesplegables>(this.datosMaestros.maestroDesplegables).Where(x => x.TipoText == tipo).OrderBy(x => x.Title).ToArray();
    }
    return listaDesplegables;
  }

  obtenerListaDesplegablesPorTipoYPadre(tipo:string, padre: number): MaestroDesplegables[]{
    let listaDesplegables = [];

    if(this.datosMaestros != null){
      listaDesplegables = new List<MaestroDesplegables>(this.datosMaestros.maestroDesplegables).Where(x => x.TipoText == tipo && x.Padre.Id === padre).OrderBy(x => x.Title).ToArray();
    }

    return listaDesplegables;
  }

  obtenerMaestrosYDatos() {
    const d: Deferred<boolean> = new Deferred<boolean>(); 
    this.masterService.getDatosMaestros().subscribe((masterLogic: MasterLogic) => {
      if (masterLogic.isDatos) {
        this.datosMaestros = masterLogic;

        d.resolve(true);
      }
    });

    return d.promise;
  }
  public obtenerParametro(parametro: string): number {
    const valor = this.route.snapshot.params[parametro]
    return valor;
  }
  private fixBotonAtrasNavegador(
    applicationRef: ApplicationRef,
    router: Router,
    zone: NgZone
  ) {
    router.events.subscribe(() => {
      zone.run(() =>
        setTimeout(() => {
          applicationRef.tick();
        }, 0)
      );
    });
  }

  public obtenerParametroID(): number {
    const id = this.route.snapshot.params.id;

    if (!id) {
      return 0;
    }

    return id;
  }

  public obtenerParametroDetalle(): number {
    const id = this.route.snapshot.params.idDetalle;

    if (!id) {
      return 0;
    }

    return id;
  }

  public obtenerParametroDetalle2(): number {
    const id = this.route.snapshot.params.idDetalle2;

    if (!id) {
      return 0;
    }

    return id;
  }

  mostrarProgreso(ocultar = true) {
      //console.log('progreso');
    // this.loading = true;
    this.loading = ocultar;
    this.spinner.show();
  }

  ocultarProgreso() {
    //console.log('progreso');
      this.spinner.hide();
      this.loading = false;
  }

  getValorControlString(nombreControl: string): string {
    if (this.form.get(nombreControl).value) {
      return this.form.get(nombreControl).value.toString().trim();
    }
    return '';
  }

  getValorControlStringMultiple(nombreControl: string): string[] {
    if (this.form.get(nombreControl).value) {
      return this.form.get(nombreControl).value;
    }
    return [];
  }

  getValorControlBoolean(nombreControl: string): boolean {
    if (this.form.get(nombreControl).value) {
      return this.form.get(nombreControl).value;
    }
    return false;
  }

  getValorControlNumber(nombreControl: string): number {
    const valor = this.form.get(nombreControl).value;

    if (valor && valor.toString().length != 0) {
      return parseInt(valor);
    }
    return 0;
  }
  getValorControlDecimal(nombreControl: string): number {
    const valor = this.form.get(nombreControl).value;

    if (valor && valor.toString().length != 0) {
      return parseFloat(valor);
    }
    return 0;
  }
  getValorControlMultipleNumber(nombreControl: string): number[] {
    const valores = this.form.get(nombreControl).value;

    if (valores) {
      return valores;
    }
    return [];
  }

  getValorControlLookup(nombreControl: string): number {
    const valor = this.form.get(nombreControl).value;

    if (valor) {
      return valor.Id;
    }
    return 0;
  }

  getValorPeoplePicker(idUsuario: number): number {
    return idUsuario;
  }

  getValorControlPeoplePicker(nombreControl: string): number {
    const usuario = this.form.get(nombreControl).value;

    if (usuario) {
      if (Array.isArray(usuario)) {
        if (usuario.length > 0) {
          return usuario[0].Id;
        }
        return 0;
      } else {
        return usuario.Id;
      }
    }

    return 0;
  }

  getValorTitleControlPeoplePicker(nombreControl: string): string {
    const usuario = this.form.get(nombreControl).value;

    if (usuario) {
      if (Array.isArray(usuario)) {
        if (usuario.length > 0) {
          return usuario[0].Title;
        }
        return '';
      } else {
        return usuario.Title;
      }
    }

    return '';
  }

  getValorControlPeoplePickerMultiple(nombreControl: string): number[] {
    const usuarios = this.form.get(nombreControl).value;

    if (usuarios) {
      return usuarios.map((usuario: User) => usuario.Id);
    }
    return [];
  }

  getValorControlDate(nombreControl: string): Date {
    return this.form.get(nombreControl).value;
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

  getFechaErrorRequerido(nombreControl: string): string {
    const control = this.form.controls[nombreControl];
    if (
      !control.valid &&
      (this.submitted || control.dirty || control.touched)
    ) {
      if (control.errors && control.errors.matDatepickerParse) {
        return "<span class='form-message'>Fecha no válida.</span>";
      }
      return "<span class='form-message'>Este campo es obligatorio.</span>";
    }
    return '';
  }

  getErrorPeoplePicker(nombreControl: string) {
    const control = this.form.controls[nombreControl];
    const usuarios = control.value;

    if (usuarios.length == 0) {
      $('.people-chip-document-owner').addClass('mat-form-field-invalid');
      return "<span class='form-message'>Este campo es obligatorio.</span>";
    } else {
      $('.people-chip-document-owner').removeClass('mat-form-field-invalid');
    }
    return '';
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

  mostrarModalInformativoConAccion(
    titulo: string,
    mensaje: string,
    callback: any,
    textoBotonSi?
  ): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = titulo;
    dialogData.tipoModal = ModalType.Warning;
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

  // mostrarModalConfirmacion(
  //   mensaje: string,
  //   callback: any,
  //   textoBotonSi?: string,
  //   textoBotonNo?: string
  // ): void {
  //   this.ocultarProgreso();

  //   const dialogData = <IDialogData>{};
  //   dialogData.mensaje = mensaje;
  //   dialogData.titulo = '';
  //   dialogData.tipoModal = ModalType.Confirm;
  //   dialogData.textoBotonSi = textoBotonSi;
  //   dialogData.textoBotonNo = textoBotonNo;

  //   const dialogRef = this.dialog.open(ModalDialog, {
  //     width: '560px',
  //     data: dialogData,
  //     // disableClose: true,
  //     disableClose: false
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(result);
  //     console.log(callback);
  //     if (callback) {
  //       callback(result);
  //     }
  //   });
  // }

  mostrarModalConfirmacion(
    that: any,
    borrador: boolean,
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
    dialogData.textoComentarios = true;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: '560px',
      data: dialogData,
      disableClose: true,
      // disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.close && callback) {
        callback( that, borrador, result.comentarios );
        // callback();
      }
    });
  }

  mostrarModalError(mensaje: string, error: any, callback?: any): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = '¡Hubo un error!';
    dialogData.titulo = '';
    dialogData.tipoModal = ModalType.Error;

    if (error) {
      this.guardarLog( error );
    }

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

  /**
   *
   * Si esObtenerGrupoId es true => R&D
   * Si esObtenerGrupoId es false => Product
   */

  obtenerPlantillaCorreo(tipo: MailTemplateType): MailTemplate {
    /*const templateCorreo = this.datosMaestros.masterData.listMailTemplates.filter((template: MailTemplate) => {
            return template.Title.toUpperCase() == tipo.toUpperCase() && template.state == State.Active;
        });

        if (templateCorreo.length > 0) {
            return templateCorreo[0];
        }*/

    return null;
  }

  navegarBandejaEvaluaciones() {
    //this.router.navigate([Variables.path.evaluationList]);
  }

  navegarDetalleEvaluacion(
    idPropuctProposal: number,
    idEvaluationSheet: number
  ) {
    // this.router.navigate(["/" + Variables.path.evaluationSheetDetalleSinParametros, idPropuctProposal, idEvaluationSheet]);
  }

  navegarNuevaHojaEvaluacion(idPropuctProposal: number) {
    /*let path = Variables.path.evaluationSheetNew;
        path = path.replace(":id", idPropuctProposal.toString());

        this.router.navigate(["/" + path]);*/
  }

  mostrarHeaderWeb() {
    $('.mat-toolbar').show();
    $('.contenedor-main').css('padding-top', '0px');
    $('.contenedor-main').css('margin-top', '0px');
    $('.contenedor-main').removeClass('main-custom-movil');
    $('mat-sidenav-container').removeClass('main-custom-movil');
  }

  ocultarHeaderWeb() {
    $('.mat-toolbar').hide();
    $('.contenedor-main').css('padding', '0px');
    $('.contenedor-main').css('margin-top', '-92px');
    $('.contenedor-main').addClass('main-custom-movil');
    $('mat-sidenav-container').addClass('main-custom-movil');
  }

  obtenerParametroString(parametro: string): string {
    const valor = this.route.snapshot.queryParams[parametro];
    return valor;
  }

  public eventoIrInicio() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.router.navigate(['/' + Variables.path.inicio]);
    } else {
      this.router.navigate(['/' + Variables.path.home]);
    }
  }

  guardarLog(err: any): void {
    const log = Log.setNuevoElemento( document.location.href, this.nombrePagina, err);
    // console.log(log);
    this.masterService.guardarLog( log ).then();
  }
}
