import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { Variables } from '../variables';
import { Funciones } from '../funciones';
import { IFieldInfo } from '@pnp/sp/fields';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    private datePipe: DatePipe
  ) { }
  
  excelListadoGeneral(nameSheet: string, nameFile: string, headers: string[], details: any[][]) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(nameSheet);

    worksheet.addRow('');

    headers.unshift('');
    const row = worksheet.addRow(headers);
    row.eachCell(
      (cell, numberCell) => {
        let width = 0;
        switch (numberCell) {
          case 1: width = 3.5; break;
          case 2: width = 4; break;
          case 3: width = 15; break;
          case 4: width = 31; break;
          case 5: width = 26; break;
          case 6: width = 26; break;
          case 7: width = 26; break;
          case 8: width = 26; break;
          case 9: width = 14; break;          
        }
        cell.worksheet.getColumn(numberCell).width = width;
        
        if (numberCell > 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {},
          };

          cell.border = Funciones.excelBorde();
  
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        
      }
    );

    details.forEach(item => {
      item.unshift('');
      console.log(item);
      worksheet.addRow(item);
    });

    workbook.xlsx.writeBuffer().then(
      (data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `${nameFile}.xlsx`);
      }
    );

  }

  excelSolicitud( headers: any, details: any, textosLargos: any, nombreArchivo: string ): void {
    
    const workbook = new Workbook();

    this.hojaFormularioInicial( workbook, headers, details, textosLargos );
    this.hojaFormularioProveedores( workbook, headers, details, textosLargos );
    this.hojaUnidadesMedida( workbook, headers, details, textosLargos );
    this.hojaOtros( workbook, headers, details );
    
    workbook.xlsx.writeBuffer().then(
      (data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `${nombreArchivo}.xlsx`);
      }
    );
  }

  hojaFormularioInicial( workbook: Workbook, headers: any, details: any, textosLargos: any ): void {
    const worksheet = workbook.addWorksheet('Formulario Inicial');
    
    worksheet.addRow([]);
    let row = worksheet.addRow(['', 'Formulario Inicial Datos Maestros de Artículos']);
    const cell = row.getCell(2);
    
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: Variables.colores.Plomo }
    };

    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = {bold: true};
    cell.border = Funciones.excelBorde();

    worksheet.mergeCells('B2:S2');    
    
    row = worksheet.addRow(['', 'MATHEAD', 'MATHEAD', 'MATHEAD', 'MAKT', 'LFM1', 'MARA', '', 'MARC', 'MARC', 'MARC', 'MARA', 'MARA', 'MARA', 'MARA', 'MARA', 'AUSPRT', 'MLAN', '']);
    
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          // console.log({value: cell.worksheet.getColumn(numberCell).values});
          let width = 0;
          switch (numberCell) {
            case 2:
            case 3:
            case 4: width = 16; break;
            case 5: width = 42; break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14: width = 16; break;
            case 15: width = 30; break;
            case 16:
            case 17:
            case 18:
            case 19: width = 16; break;            
          }
          cell.worksheet.getColumn(numberCell).width = width;
          let color = '';
          
          if ((numberCell >= 2 && numberCell <= 8) || (numberCell >= 17 && numberCell <= 19)) {
            color = Variables.colores.Plomo;
          } else if (numberCell === 9 || numberCell === 10) {
            color = Variables.colores.Celeste;
          } else if (numberCell >= 11 && numberCell <= 13) {
            color = Variables.colores.Naranja;
          } else if (numberCell >= 14 && numberCell <= 16) {
            color = Variables.colores.Verde;
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.worksheet.getColumn(numberCell).width = 6;
        }
      }
    );

    row = worksheet.addRow(['', 'MATL_TYPE', 'MATL_GROUP', 'MATL_CAT', 'MATL_DESC', 'ELIFN', 'DIVISION', '', 'CC_PH_INV', '', 'BATCH_MGMT', 'LABEL_TYPE', 'LABEL_FORM', 'MIMREMLIFE', 'PERIOD_IND_EXPIRATION_DATE', 'STOR_PCT', 'CHAR_VALUE', 'TAX_TYPE_1', '']);
    
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          let color = '';

          if ((numberCell >= 2 && numberCell <= 8) || (numberCell >= 17 && numberCell <= 19)) {
            color = Variables.colores.Plomo;
          } else if (numberCell === 9 || numberCell === 10) {
            color = Variables.colores.Celeste;
          } else if (numberCell >= 11 && numberCell <= 13) {
            color = Variables.colores.Naranja;
          } else if (numberCell >= 14 && numberCell <= 16) {
            color = Variables.colores.Verde;
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };

          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    );

    row = worksheet.addRow(['', 'RMMW1-MTART', 'MARA-MATKL', 'RMMW1-ATTYP', 'MAKT-MAKTX', '', 'MARA-SPART', 'MBEW-BKLAS', 'MARC-ABCIN', 'MARC-EKGRP', 'MARC-XCHPF', 'MARA-ETIAR', 'MARA-ETIFO', 'MARA-MHDRZ', 'MARA-IPRKZ', 'MARA-MHDLP', 'DESCUENTOR', '', '']);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          let color = '';

          if ((numberCell >= 2 && numberCell <= 8) || (numberCell >= 17 && numberCell <= 19)) {
            color = Variables.colores.Plomo;
          } else if (numberCell === 9 || numberCell === 10) {
            color = Variables.colores.Celeste;
          } else if (numberCell >= 11 && numberCell <= 13) {
            color = Variables.colores.Naranja;
          } else if (numberCell >= 14 && numberCell <= 16) {
            color = Variables.colores.Verde;
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    );

    row = worksheet.addRow(['', 'Identifica al artículo según su orígen', 'Línea Comercial', 'Indica la categoría del material', 'Descripción del artículo, incluyendo la presentación', 'Código de Proveedor SAP que suministrará el artículo', 'Sector comercial', 'Indica si el producto es consignado', 'Indicador de inventario para recuento ciclico', 'Clave de un comprador o grupo de compradores responsable(s) para determinadas actividades de compras.', 'Indica si el artículo está sujeto a lote.', 'Unidad de medida en que nos atiende el proveedor', 'Indica si el lote viene del proveedor o es un lote interno', 'Tiempo mínimo de duración desde el ingreso de la mercadería hasta su fecha de vencimiento', 'Indica en que tiempo está expresado el tiempo mínimo de duración', 'Porcentaje de tiempo que indica desde cuando el material se traslada a un almacen de próximo vencimiento', 'Indica si el descuento aplicado para la venta es o no recuperable con el proveedor', 'Indica si el artículo está o no afecto al IGV para la venta', 'Indicar si es Oncologico o Retroviral']);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          let color = '';

          if ((numberCell >= 2 && numberCell <= 8) || (numberCell >= 17 && numberCell <= 19)) {
            color = Variables.colores.Plomo;
          } else if (numberCell === 9 || numberCell === 10) {
            color = Variables.colores.Celeste;
          } else if (numberCell >= 11 && numberCell <= 13) {
            color = Variables.colores.Naranja;
          } else if (numberCell >= 14 && numberCell <= 16) {
            color = Variables.colores.Verde;
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          // cell.alignment = {wrapText: true};
        }
      }
    );
    
    const propiedades = [
      'IdTipoMaterial', 'IdGrupoArticulo', 'IdCategoriaMaterial', 'TextoBreveMaterial', 'IdProveedorSAP', 'IdSector', 'IdConsignado', 'IdInventarioCiclico', 
      'IdGrupoCompras', 'IdSujetoLote', 'IdClaseEtiqueta', 'IdFormaEtiqueta', 'TiempoHastaCaducidad', 'IdIndicadorPeriodoPFECaducidad', 'TiempoCaducidadEnAlmacen',
      'IdMarcaRecuperacionDctoR', 'IdIGV', 'IdClasificacionArticulo'
    ];

    const newRow: any[] = [''];

    propiedades.forEach( item => newRow.push( headers[item] ) );
    // console.log({newRow});

    row = worksheet.addRow(newRow);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          let color = '';

          if ((numberCell >= 2 && numberCell <= 8) || (numberCell >= 17 && numberCell <= 19)) {
            color = Variables.colores.Plomo;
          } else if (numberCell === 9 || numberCell === 10) {
            color = Variables.colores.Celeste;
          } else if (numberCell >= 11 && numberCell <= 13) {
            color = Variables.colores.Naranja;
          } else if (numberCell >= 14 && numberCell <= 16) {
            color = Variables.colores.Verde;
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          // cell.alignment = {wrapText: true};
        }
      }
    );
    
    newRow.splice( 1, newRow.length - 1);
    const formats = [''];

    propiedades.forEach(
      item => {
        if(details[item]) {
          newRow.push( details[item].value );
          formats.push( details[item].format );
        } else {
          console.log(item);
        }
      }
    );

    row = worksheet.addRow(newRow);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

          if (formats[numberCell] !== '') {
            cell.numFmt = formats[numberCell];
          }
        }
      }
    );
  }
  
  hojaFormularioProveedores( workbook: Workbook, headers: any, details: any, textosLargos: any ): void {
    const worksheet = workbook.addWorksheet('Formulario para Proveedores');
    
    worksheet.addRow([]);
    let row = worksheet.addRow(['', '', 'Datos Maestros de Artículos para solicitar a Proveedores']);
    const cell = row.getCell(3);
    
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: Variables.colores.Plomo }
    };

    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = {bold: true};
    cell.border = Funciones.excelBorde();

    worksheet.mergeCells('C2:AC2');    
    
    const newRows = [];
    newRows.push([
      '', '', 'MAKT', 'MARA', 'MARA', 'MARA', 'MARA', 'MARA', 'MARA', 'MARA', 'MVKE', 'MARA', 'EINA', 'EINA', 'EINE', 'EINE', 'EINE', 
      'EINE', '', '', '', '', '', 'MARC', 'EINA', '', '', '', ''
    ]);

    newRows.push([
      '', '', 'MATL_DESC', 'PROD_HIER', 'PROD_HIER', 'PROD_HIER', 'PRICE_BAND', 'BASIC_MATL_NEW', 'SHELF_LIFE', 'STOR_CONDS', 'PRC_GROUP2', 'TEMP_CONDS', 'IDNFLF'
      , 'URZLA', 'APLFZ', 'NETPR', 'WAERS', 'INCO1', '', '', '', '', '', '', 'COMM_CODE', '', '', '', '', ''
    ]);

    newRows.push([
      '', '', 'MAKT-MAKTX', 'MARA-PRDHA', 'MARA-PRDHA', 'MARA-PRDHA', 'MARA-PLGTP', 'MARA-WRKST', 'MARA-MHDHB', 'MARA-RAUBE', 'MVKE-MVGR2', 'MARA-TEMPB', 
      'EINA-IDNLF', 'MAW1-WHERL', 'EINE-APLFZ', 'EINE-NETPR', 'EINE-WAERS', 'EINE-INCO1', '', '', '', '', '', 'MARC-STAWN', 'EINA-URZTP', 
      '', '', '', ''
    ]);

    newRows.forEach(
      item => {
        row = worksheet.addRow(item);
    
        row.eachCell(
          (cell, numberCell) => {
          
            if (numberCell > 1) {
              let width = 0;
    
              if (numberCell === 2) {
                width = 11;
              } else if (numberCell === 3) {
                width = 44;
              } else if (Funciones.BetWeen(numberCell, 4, 7) || Funciones.BetWeen(numberCell, 9, 29)) {
                width = 21;
              } else if (numberCell === 8) {
                width = 32;
              }
    
              cell.worksheet.getColumn(numberCell).width = width;
              let color = '';
              
              if (numberCell === 1 || Funciones.BetWeen(numberCell, 7, 29)) {
                color = Variables.colores.Plomo;
              } else if (Funciones.BetWeen(numberCell, 3, 5)) {
                color = Variables.colores.Celeste;
              }
              
              if (color !== '') {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: color },
                };
              }
              
              if (numberCell > 2) {
                cell.border = Funciones.excelBorde();
              }
    
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
              cell.worksheet.getColumn(numberCell).width = 6;
            }
          }
        );
      }
    );
    
    const propiedadesExport = [
      'CodigoSAPQS', 'TextoBreveMaterial', 'IdJerarquiProducto1', 'IdJerarquiProducto2', 'IdJerarquiProducto3', 'IdMarcaRXOTC', 'NombreGenerico', 
      'DuracionTotalConservacion', 'IdCondicionAlmacenaje', 'IdClasificacionMaterial', 'IdCondicionTemperatura', 'CodigoArticuloProveedor', 'IdPaisOrigen', 
      'PlazoEntregaPrevisto', 'ValorCompraQS', 'IdMonedaCompraQs', 'IdIncoterm', 'ValorVentaQS', 'IdMonedaVenta', 'MargenTeorico', 'CodigoOp', 'CodigoSunat', 
      'PartidaArancelaria', 'IdTipoCertificado', 'RegistroSanitario', 'FechaInicioRegistroSanitario', 'FechaVencimientoRegistroSanitari', 'IdRefrigerado'
    ];

    const newRow: any[] = [''];    

    propiedadesExport.forEach( item => newRow.push( textosLargos[item] || '' ) );
    
    // console.log(newRow);

    row = worksheet.addRow(newRow);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 2) {
          // let color = Variables.colores.Blanco;
          let color = '';

          if (Funciones.BetWeen(numberCell, 4, 6)) {
            color = Variables.colores.Celeste;
          } else if (Funciones.BetWeen(numberCell, 22, 23)) {
            color = Variables.colores.VerdeTono;
          }

          if (color !== '') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            };
          }
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
      }
    );
    
    newRow.splice( 1, newRow.length - 1);

    propiedadesExport.forEach( item => newRow.push( headers[item] ) );
    // console.log({newRow});

    row = worksheet.addRow(newRow);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          let color = '';

          if (Funciones.BetWeen(numberCell, 2, 21)) {
            color = Variables.colores.Crema;
          } else if (Funciones.BetWeen(numberCell, 22, 23) || numberCell === 29) {
            color = Variables.colores.VerdeTono;
          } else if (Funciones.BetWeen(numberCell, 24, 28)) {
            color = Variables.colores.Azul;
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          // cell.alignment = {wrapText: true};
        }
      }
    );
    
    newRow.splice( 1, newRow.length - 1);
    const formats = [''];

    propiedadesExport.forEach(
      item => {
        if (['FechaInicioRegistroSanitario', 'FechaVencimientoRegistroSanitari'].includes(item)) {
          newRow.push( Funciones.dateFormat( new Date( details[item].value ) ) );
        } else {
          newRow.push( details[item].value );
        }
        formats.push( details[item].format );
      }
    );
    // propiedadesExport.forEach( item => newRow.push( details[item].value ) );

    row = worksheet.addRow(newRow);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

          if (formats[numberCell - 1] !== '') {
            cell.numFmt = formats[numberCell - 1];
          }
        }
      }
    );
  }

  hojaUnidadesMedida( workbook: Workbook, headers: any, details: any, textosLargos: any ): void {
    const worksheet = workbook.addWorksheet('Unidades de Medida');
    
    let row = worksheet.addRow([
      '', 'MATERIAL', 'DESCRIPCIÓN', 'EAN/UPC', 'UNIDAD DE VENTA', '', '', '', '', '', '', '', '', '', 'EAN 14', 'MASTER PACK', '', '', '', '', '', '', '', ''
    ]);
  
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          let width = 0;

          if (numberCell === 2) {
            width = 17;
          } else if (numberCell === 3) {
            width = 44;
          } else if ([4, 15].includes( numberCell )) {
            width = 20;
          } else if (Funciones.BetWeen(numberCell, 5, 13) || Funciones.BetWeen(numberCell, 16, 24)) {
            width = 13;
          } else if (numberCell === 14) {
            width = 5;
          }

          cell.worksheet.getColumn(numberCell).width = width;
          let color = '';
          
          if (numberCell !== 14) {
            color = Variables.colores.Plomo;
          }
          
          if (color !== '') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            };
            
            cell.font = {bold: true};
            cell.border = Funciones.excelBorde();            
          }
          

          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.worksheet.getColumn(numberCell).width = 6;
        }
      }
    );

    row = worksheet.addRow([
      '', '', '', '', 'CANTIDAD', 'UMI', 'LARGO', 'ANCHO', 'ALTURA', 'DIM', 'PESO BRUTO', 'PESO NETO', 'UM PESO', '', '', 'CANTIDAD', 'UMI', 'LARGO', 'ANCHO', 'ALTURA', 
      'DIM', 'PESO BRUTO', 'PESO NETO', 'UM PESO'
    ]);
  
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          let color = '';
          
          if (numberCell !== 14) {
            color = Variables.colores.Plomo;
          }
          
          if (color !== '') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            };
            
            // cell.font = {bold: true};
            cell.border = Funciones.excelBorde();            
          }
          

          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    );

    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('C1:C2');
    worksheet.mergeCells('D1:D2');
    worksheet.mergeCells('E1:M1');
    worksheet.mergeCells('O1:O2');
    worksheet.mergeCells('P1:X1');
    
    row = worksheet.addRow([
      '', details.CodigoSAPQS.value, details.TextoBreveMaterial.value, details.UVEanUpc.value, details.UVCantidad.value, 
      details.IdUVUmi.value, details.UVLargo.value, details.UVAncho.value, details.UVAltura.value, details.IdUVDIM.value, 
      details.UVPesoBruto.value, details.UVPesoNeto.value, details.IdUVUmPeso.value, '', details.MPEAN14.value, 
      details.MPCantidad.value, details.IdMPUmi.value, details.MPLargo.value, details.MPAncho.value, details.MPAltura.value, 
      details.IdMPDIM.value, details.MPPesoBruto.value, details.MPPesoNeto.value, details.IdMPUmPeso.value
    ]);

    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          if ([6, 10, 13, 17, 21, 24].includes( numberCell )) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          }
          
          let campoName = '';
          switch (numberCell) {
            case 5:
              campoName = 'UVCantidad';
              break;

            case 7:
              campoName = 'UVLargo';
              break;

            case 8:
              campoName = 'UVAncho';
              break;

            case 9:
              campoName = 'UVAltura';
              break;

            case 11:
              campoName = 'UVPesoBruto';
              break;

            case 12:
              campoName = 'UVPesoNeto';
              break;
            
            case 16:
              campoName = 'MPCantidad';
              break;

            case 18:
              campoName = 'MPLargo';
              break;

            case 19:
              campoName = 'MPAncho';
              break;

            case 20:
              campoName = 'MPAltura';
              break;

            case 22:
              campoName = 'MPPesoBruto';
              break;

            case 23:
              campoName = 'MPPesoNeto';
              break;
          }
          
          if (campoName !== '') {
            const format = details[campoName].format;
            if (format !== '') {
              cell.numFmt = format;
            }

          }
        }
      }
    );
        
  }

  hojaOtros( workbook: Workbook, headers: any, details: any ): void {
    const worksheet = workbook.addWorksheet('Otros');

    worksheet.addRow(['']);

    const propiedades: string[] = [
      'Marca', 'IdFormaFarmaceutica', 'ValorConcentracion', 'MedidaConcentracion', 'OrgCompra', 'IdJerarquiProducto1', 
      'IdJerarquiProducto2', 'IdJerarquiProducto3', 'IdJerarquiProducto4', 'IdJerarquiProducto5', 'IdCT1', 'IdCT2', 'IdCT3', 'IdCT4', 
      'IdGrupoImputacionMaterial', 'Sociedad', 'CentroBeneficio', 'IdReqEspeTecnica', 'IdPaisCreacion', 'IdGrupoTransporte', 
      'IdGrupoTipoPosicionGeneral', 'IdSusceptibleBonEsp', 'MarcaListaPrecio', 'IdMarcaMostrarPalmWeb', 'IdMostrarStocks', 
      'IdMostrarClientes', 'IdVerificacionDisponibilidad', 'OrgVenta', 'IdCanalDistribucion', 'CentroSuministrador', 'IdSusceptibleBonificacion'
    ];

    const newRow: any[] = [
      ''
    ];

    propiedades.forEach( item => newRow.push( headers[item] ) );

    let row = worksheet.addRow(newRow);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {

          cell.worksheet.getColumn(numberCell).width = 35;

          const color = Variables.colores.Plomo;

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    );
    
    newRow.splice( 1, newRow.length - 1);
    const formats = [''];

    propiedades.forEach(
      item => {
        newRow.push( details[item].value );
        formats.push( details[item].format );
      }
    );

    row = worksheet.addRow(newRow);
    row.eachCell(
      (cell, numberCell) => {
      
        if (numberCell > 1) {
          
          cell.border = Funciones.excelBorde();

          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

          if (formats[numberCell] !== '') {
            cell.numFmt = formats[numberCell];
          }
        }
      }
    );
  }

}
