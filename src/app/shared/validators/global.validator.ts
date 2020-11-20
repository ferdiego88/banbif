import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import { ErrorStateMatcher } from '@angular/material';
// import { global } from '../services/global';

export class CustomValidators {
  static childrenEqual: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const f = control as FormGroup;

    const [firstControlName, ...otherControlNames] = Object.keys(f.controls || {});

    if(f.get(firstControlName) == null) {
      return null;
    }

    otherControlNames.forEach(controlName => {
      if(f.get(controlName) == null) {
        return null;
      }
    })

    const isValid = otherControlNames.every(controlName => f.get(controlName)!.value === f.get(firstControlName)!.value);
    return isValid ? null : { childrenNotEqual: true };
  }
}

// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     return control.parent.invalid && control.touched;
//   }
// }

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    // console.log({
    //   stateMatcher: true,
    //   form,
    //   control,
    //   state1: control && control.invalid && (control.dirty || control.touched),
    //   state2: !!(control && control.invalid && (control.dirty || control.touched))
    // });
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

export const regExps: { [key: string]: RegExp } = {
//   password: global.passwordPattern,
//   email: global.emailPattern
};

export const errorMessagesSolicitudForm: { [key: string]: string } = {
    IdTipoMaterial: 'El Campo es Obligatorio.',
    CodigoSAPQS: 'El Campo es Obligatorio.',
    TextoBreveMaterial: 'El Campo debe tener entre 1 y 40 caracteres.',
    CentroBeneficio: 'El Campo debe tener entre 1 y 10 caracteres.',
    CodigoArticuloProveedor: 'El Campo debe tener entre 1 y 16 caracteres.',
    CodigoOp: 'El Campo debe tener entre 1 y 10 caracteres.',
    CodigoSunat: 'El Campo tiene un mínimo de 10000000 y 99999999.',
    DuracionTotalConservacion: 'El Campo es Obligatorio.',
    // FechaInicioRegistroSanitario: Fri Jul 17 2020 09:32:25 GMT-0500 (hora estándar de Perú) {}
    // FechaVencimientoRegistroSanitario: Fri Jul 17 2020 09:32:25 GMT-0500 (hora estándar de Perú) {}
    IdFormaFarmaceutica: 'El Campo es Obligatorio.',
    IdCT1: 'El Campo es Obligatorio.',
    IdCT2: 'El Campo es Obligatorio.',
    IdCT3: 'El Campo es Obligatorio.',
    IdCT4: 'El Campo es Obligatorio.',
    IdCategoriaMaterial: 'El Campo es Obligatorio.',
    IdClaseEtiqueta: 'El Campo es Obligatorio.',
    IdClasificacionArticulo: 'El Campo es Obligatorio.',
    IdClasificacionMaterial: 'El Campo es Obligatorio.',
    IdCondicionAlmacenaje: 'El Campo es Obligatorio.',
    IdCondicionTemperatura: 'El Campo es Obligatorio.',
    IdConsignado: 'El Campo es Obligatorio.',
    IdFormaEtiqueta: 'El Campo es Obligatorio.',
    IdGrupoArticulo: 'El Campo es Obligatorio.',
    IdGrupoCompras: 'El Campo es Obligatorio.',
    IdGrupoImputacionMaterial: 'El Campo es Obligatorio.',
    IdIGV: 'El Campo es Obligatorio.',
    IdIncoterm: 'El Campo es Obligatorio.',
    IdIndicadorPeriodoPFECaducidad: 'El Campo es Obligatorio.',
    IdInventarioCiclico: 'El Campo es Obligatorio.',
    IdJerarquiProducto1: 'El Campo es Obligatorio.',
    IdJerarquiProducto2: 'El Campo es Obligatorio.',
    IdJerarquiProducto3: 'El Campo es Obligatorio.',
    IdJerarquiProducto4: 'El Campo es Obligatorio.',
    IdJerarquiProducto5: 'El Campo es Obligatorio.',
    IdMPDIM: 'El Campo es Obligatorio.',
    IdMPUmPeso: 'El Campo es Obligatorio.',
    IdMPUmi: 'El Campo es Obligatorio.',
    // IdMaestroRutaFlujo: 
    IdMarcaRXOTC: 'El Campo es Obligatorio.',
    IdMarcaRecuperacionDctoR: 'El Campo es Obligatorio.',
    IdMonedaCompraQs: 'El Campo es Obligatorio.',
    IdMonedaVenta: 'El Campo es Obligatorio.',
    IdRefrigerado: 'El Campo es Obligatorio.',
    IdReqEspeTecnica: 'El Campo es Obligatorio.',
    IdSector: 'El Campo es Obligatorio.',
    IdSujetoLote: 'El Campo es Obligatorio.',
    IdTipoCertificado: 'El Campo es Obligatorio.',
    IdUVDIM: 'El Campo es Obligatorio.',
    IdUVUmPeso: 'El Campo es Obligatorio.',
    IdUVUmi: 'El Campo es Obligatorio.',
    MPAltura: 'El Campo es Obligatorio.',
    MPAncho: 'El Campo es Obligatorio.',
    MPCantidad: 'El Campo es Obligatorio.',
    MPEAN14: 'El Campo debe tener 14 caracteres.',
    MPLargo: 'El Campo es Obligatorio.',
    MPPesoBruto: 'El Campo es Obligatorio.',
    MPPesoNeto: 'El Campo es Obligatorio.',
    // MaestroFLujoEtapaId: 'El Campo es Obligatorio.',
    Marca: 'El Campo debe tener entre 1 y 30 caracteres.',
    MargenTeorico: 'El Campo es Obligatorio.',
    MedidaConcentracion: 'El Campo debe tener entre 1 y 5 caracteres.',
    NombreGenerico: 'El Campo debe tener entre 1 y 45 caracteres.',
    OrgCompra: 'El Campo es Obligatorio.',
    IdPaisCreacion: 'El Campo es Obligatorio.',
    IdPaisOrigen: 'El Campo es Obligatorio.',
    PartidaArancelaria: 'El Campo debe tener entre 1 y 13 caracteres.',
    PlazoEntregaPrevisto: 'El Campo es Obligatorio.',
    IdProveedorSAP: 'El Campo es Obligatorio.',
    RegistroSanitario: 'El Campo debe tener entre 1 y 30 caracteres.',
    Sociedad: 'El Campo es Obligatorio.',
    TiempoCaducidadEnAlmacen: 'El Campo es Obligatorio.',
    TiempoHastaCaducidad: 'El Campo es Obligatorio.',
    // Title: ""
    UVAltura: 'El Campo es Obligatorio.',
    UVAncho: 'El Campo es Obligatorio.',
    UVCantidad: 'El Campo es Obligatorio.',
    UVEanUpc: 'El Campo debe tener 13 caracteres.',
    UVLargo: 'El Campo es Obligatorio.',
    UVPesoBruto: 'El Campo es Obligatorio.',
    UVPesoNeto: 'El Campo es Obligatorio.',
    ValorCompraQS: 'El Campo es Obligatorio.',
    ValorConcentracion: 'El Campo debe tener entre 1 y 20 caracteres.',
    ValorVentaQS: 'El Campo es Obligatorio.',
    IdGrupoTransporte: 'El Campo es Obligatorio.',
    IdGrupoTipoPosicionGeneral: 'El Campo es Obligatorio.',
    IdSusceptibleBonEsp: 'El Campo es Obligatorio.',
    MarcaListaPrecio: 'El Campo debe tener 1 caracter.',
    IdMarcaMostrarPalmWeb: 'El Campo es Obligatorio.',
    IdMostrarStocks: 'El Campo es Obligatorio.',
    IdMostrarClientes: 'El Campo es Obligatorio.',
    IdVerificacionDisponibilidad: 'El Campo es Obligatorio.',
    IdSusceptibleBonificacion: 'El Campo es Obligatorio.',
    OrgVenta: 'El Campo es Obligatorio.',
    IdCanalDistribucion: 'El Campo es Obligatorio.',
    CentroSuministrador: 'El Campo es Obligatorio.'

};