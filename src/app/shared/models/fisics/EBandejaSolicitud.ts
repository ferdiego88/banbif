import { User } from './base/User';
import { Lookup } from './base/Lookup';
import { Variables, SPParse } from '../../variables';

export class EBandejaSolicitud {
    Id: number;
    Author: string;
    Created: Date;
    Nombre_Titular: string;
    Tipo_Documento: string;
    N_Documento: string;
    Tipo_Producto: string;
    Estado: string;
    EstadoLegal: string;
    EstadoMiVivienda: string;
    EstadoGestor: string;
    Moneda: string;
    SimboloMoneda: string;
    Precio_Venta: string;
    Modalidad_Pago: string;
    Financiamiento: string;
    Zona: string;
    Oficina: string;
    Sustento_Ingresos: string;
    Fecha_Estado: Date;
    TiempoAtencion: string;
    Desembolso: string;
    Agencia: string;
    //U_Responsable: string;
    Anlista_Riesgos: string;
    Oferta: string;
    Tipo_Renta: string;

    constructor() {
        this.Id = 0;
        this.Author = "";
        this.Created = new Date();
        this.Nombre_Titular = "";
        this.Tipo_Documento = "";
        this.N_Documento = "";
        this.Tipo_Producto = "";
        this.Estado = "";
        this.EstadoLegal = "";
        this.EstadoMiVivienda = "";
        //this.EstadoGestor = "";
        this.Moneda = "";
        this.SimboloMoneda = "";
        this.Precio_Venta = "";
        this.Modalidad_Pago = "";
        this.Financiamiento = "";
        this.Zona = "";
        this.Oficina = "";
        this.Sustento_Ingresos = "";
        this.Fecha_Estado = new Date();
        this.TiempoAtencion = "";
        this.Desembolso = "";
        //this.Agencia = "";
        //this.U_Responsable = "";
        this.Anlista_Riesgos = "";
        this.Oferta = "";
        this.Tipo_Renta = "";
    }

    public static getColumnasSelect(): string[] {
        return [
            Variables.columnasSolicitud.ID,
            Variables.columnasSolicitud.Author + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Created,
            Variables.columnasSolicitud.NombreTitular,
            //Variables.columnasSolicitud.TipoDocumento + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.NumeroDocumento,
            Variables.columnasSolicitud.TipoProducto + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Estado + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.EstadoLegal + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.EstadoMiVivienda + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Moneda + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.PrecioVenta,
            Variables.columnasSolicitud.ModalidadPago + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Financiamiento,
            Variables.columnasSolicitud.Zona + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Oficina + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.SustentoIngreso + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.FechaEstado,
            Variables.columnasSolicitud.Desembolso,
            Variables.columnasSolicitud.Anlista_Riesgos + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Oferta,
            Variables.columnasSolicitud.TipoRenta + '/' + Variables.columnasSolicitud.Title 
        ];
    }

    public static getColumnasExpand(): string[] {
        return [
            Variables.columnasSolicitud.Author,
            //Variables.columnasSolicitud.TipoDocumento,
            Variables.columnasSolicitud.TipoProducto,
            Variables.columnasSolicitud.Estado,
            Variables.columnasSolicitud.EstadoLegal,
            Variables.columnasSolicitud.EstadoMiVivienda,
            Variables.columnasSolicitud.Moneda,
            Variables.columnasSolicitud.ModalidadPago,
            Variables.columnasSolicitud.Zona,
            Variables.columnasSolicitud.Oficina,
            Variables.columnasSolicitud.SustentoIngreso,
            Variables.columnasSolicitud.Anlista_Riesgos,
            Variables.columnasSolicitud.TipoRenta
        ];
    }

    public static getColumnasSelectBandejaTrabajoGestor(): string[] {
        return [
            Variables.columnasSolicitud.ID,
            Variables.columnasSolicitud.Author + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Created,
            Variables.columnasSolicitud.NombreTitular,
            Variables.columnasSolicitud.TipoDocumento + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.NumeroDocumento,
            Variables.columnasSolicitud.TipoProducto + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Estado + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.EstadoLegal + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.EstadoMiVivienda + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Moneda + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.PrecioVenta,
            //Variables.columnasSolicitud.ModalidadPago + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Financiamiento,
            Variables.columnasSolicitud.Zona + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Oficina + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.SustentoIngreso + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.FechaEstado,
            Variables.columnasSolicitud.Desembolso,
            Variables.columnasSolicitud.Anlista_Riesgos + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Oferta,
            Variables.columnasSolicitud.TipoRenta + '/' + Variables.columnasSolicitud.Title 
        ];
    }

    public static getColumnasExpandBandejaTrabajoGestor(): string[] {
        return [
            Variables.columnasSolicitud.Author,
            Variables.columnasSolicitud.TipoDocumento,
            Variables.columnasSolicitud.TipoProducto,
            Variables.columnasSolicitud.Estado,
            Variables.columnasSolicitud.EstadoLegal,
            Variables.columnasSolicitud.EstadoMiVivienda,
            Variables.columnasSolicitud.Moneda,
            //Variables.columnasSolicitud.ModalidadPago,
            Variables.columnasSolicitud.Zona,
            Variables.columnasSolicitud.Oficina,
            Variables.columnasSolicitud.SustentoIngreso,
            Variables.columnasSolicitud.Anlista_Riesgos,
            Variables.columnasSolicitud.TipoRenta
        ];
    }

    public static getColumnasSelectBandejaTrabajoLegal(): string[] {
        return [
            Variables.columnasSolicitud.ID,
            Variables.columnasSolicitud.Author + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Created,
            Variables.columnasSolicitud.NombreTitular,
            Variables.columnasSolicitud.TipoDocumento + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.NumeroDocumento,
            Variables.columnasSolicitud.TipoProducto + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Estado + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.EstadoLegal + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Moneda + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.PrecioVenta,
            Variables.columnasSolicitud.ModalidadPago + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Financiamiento,
            Variables.columnasSolicitud.Zona + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Oficina + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.SustentoIngreso + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.FechaEstado,
            Variables.columnasSolicitud.Desembolso,
            Variables.columnasSolicitud.Anlista_Riesgos + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Oferta,
            Variables.columnasSolicitud.TipoRenta + '/' + Variables.columnasSolicitud.Title 
        ];
    }

    public static getColumnasExpandBandejaTrabajoLegal(): string[] {
        return [
            Variables.columnasSolicitud.Author,
            Variables.columnasSolicitud.TipoDocumento,
            Variables.columnasSolicitud.TipoProducto,
            Variables.columnasSolicitud.Estado,
            Variables.columnasSolicitud.EstadoLegal,
            Variables.columnasSolicitud.Moneda,
            Variables.columnasSolicitud.ModalidadPago,
            Variables.columnasSolicitud.Zona,
            Variables.columnasSolicitud.Oficina,
            Variables.columnasSolicitud.SustentoIngreso,
            Variables.columnasSolicitud.Anlista_Riesgos,
            Variables.columnasSolicitud.TipoRenta
        ];
    }

    public static parseJson(elemento: any): EBandejaSolicitud {
        const item = new EBandejaSolicitud();

        item.Id = SPParse.getNumber(elemento[Variables.columnasSolicitud.ID]);
        item.Author = User.parseJson(elemento[Variables.columnasSolicitud.Author]).Title.toUpperCase();
        item.Created = SPParse.getDate(elemento[Variables.columnasSolicitud.Created]);
        item.Nombre_Titular = SPParse.getString(elemento[Variables.columnasSolicitud.NombreTitular]).toUpperCase();
        item.Tipo_Documento = Lookup.parseJson(elemento[Variables.columnasSolicitud.TipoDocumento]).Title.toUpperCase();
        item.N_Documento = SPParse.getString(elemento[Variables.columnasSolicitud.NumeroDocumento]).toUpperCase();
        item.Tipo_Producto = Lookup.parseJson(elemento[Variables.columnasSolicitud.TipoProducto]).Title.toUpperCase();
        item.Estado = Lookup.parseJson(elemento[Variables.columnasSolicitud.Estado]).Title.toUpperCase();
        item.EstadoLegal = Lookup.parseJson(elemento[Variables.columnasSolicitud.EstadoLegal]).Title.toUpperCase();
        item.EstadoMiVivienda = Lookup.parseJson(elemento[Variables.columnasSolicitud.EstadoMiVivienda]).Title.toUpperCase();
        item.EstadoGestor = Lookup.parseJson(elemento[Variables.columnasSolicitud.EstadoGestor]).Title.toUpperCase();
        item.Moneda = Lookup.parseJson(elemento[Variables.columnasSolicitud.Moneda]).Title.toUpperCase();
        item.Precio_Venta = SPParse.getString(elemento[Variables.columnasSolicitud.PrecioVenta]);
        item.Modalidad_Pago = Lookup.parseJson(elemento[Variables.columnasSolicitud.ModalidadPago]).Title.toUpperCase();
        item.Financiamiento = SPParse.getString(elemento[Variables.columnasSolicitud.Financiamiento]).toUpperCase();
        item.Zona = Lookup.parseJson(elemento[Variables.columnasSolicitud.Zona]).Title.toUpperCase();
        item.Oficina = Lookup.parseJson(elemento[Variables.columnasSolicitud.Oficina]).Title.toUpperCase();
        item.Agencia = Lookup.parseJson(elemento[Variables.columnasSolicitud.Agencia]).Title.toUpperCase();
        item.Sustento_Ingresos = Lookup.parseJson(elemento[Variables.columnasSolicitud.SustentoIngreso]).Title.toUpperCase();
        item.Fecha_Estado = SPParse.getDate(elemento[Variables.columnasSolicitud.FechaEstado]);
        item.Desembolso = SPParse.getString(elemento[Variables.columnasSolicitud.Desembolso]);
        //item.U_Responsable = User.parseJsonListNombres(elemento[Variables.columnasSolicitud.UResponsable]).toUpperCase();
        item.Anlista_Riesgos = User.parseJson(elemento[Variables.columnasSolicitud.Anlista_Riesgos]).Title.toUpperCase();
        item.Oferta = elemento[Variables.columnasSolicitud.Oferta] === true ? "SI" : "NO";
        item.Tipo_Renta = Lookup.parseJsonListNombres(elemento[Variables.columnasSolicitud.TipoRenta]).toUpperCase();
              
        /*if (item.Financiamiento !== "") {
            item.Financiamiento = Math.round(parseFloat(item.Financiamiento) * 100) + " %"
        }*/

        if (item.Moneda === "SOLES") {
            item.SimboloMoneda = "S/";
        }
        else if (item.Moneda === "DOLARES" || item.Moneda === "DÓLARES") {
            item.SimboloMoneda = "$";
        }

        return item;
    }

    public static parseJsonList(list: any): EBandejaSolicitud[] {

        let items: EBandejaSolicitud[] = [];

        list.forEach(elemento => {
            const item = EBandejaSolicitud.parseJson(elemento);
            items.push(item);
        });

        return items;
    }
}