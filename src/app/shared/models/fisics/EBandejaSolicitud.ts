import { LookupAddress } from 'dns';
import { User } from './base/User';
import { Lookup } from './base/Lookup';
import { Variables, SPParse } from '../../variables';

export class EBandejaSolicitud {
    Id: number;
    Title: string;
    Author: string;
    Created: Date;
    NombreTitular: string;
    TipoDocumento: string;
    NumeroDocumento: string;
    TipoProducto: string;
    Estado: string;
    Moneda: string;
    PrecioVenta: string;
    ModalidadPago: string;
    Financiamiento: string;
    Zona: string;
    Oficina: string;
    SustentoIngreso: string;
    FechaEstado: Date;

    constructor() {
        this.Id = 0;
        this.Title = "";
        this.Author = "";
        this.Created = new Date();
        this.NombreTitular = "";
        this.TipoDocumento = "";
        this.NumeroDocumento = "";
        this.TipoProducto = "";
        this.Estado = "";
        this.Moneda = "";
        this.PrecioVenta = "";
        this.ModalidadPago = "";
        this.Financiamiento = "";
        this.Zona = "";
        this.Oficina = "";
        this.SustentoIngreso = "";
        this.FechaEstado = new Date();
    }

    public static getColumnasSelect(): string[] {
        return [
            Variables.columnasSolicitud.ID,
            Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Author + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Created,
            Variables.columnasSolicitud.NombreTitular,
            Variables.columnasSolicitud.TipoDocumento + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.NumeroDocumento,
            Variables.columnasSolicitud.TipoProducto + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Estado + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Moneda + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.PrecioVenta,
            Variables.columnasSolicitud.ModalidadPago + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Financiamiento,
            Variables.columnasSolicitud.Zona + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.Oficina + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.SustentoIngreso + '/' + Variables.columnasSolicitud.Title,
            Variables.columnasSolicitud.FechaEstado
        ];
    }

    public static getColumnasExpand(): string[] {
        const campos = [
            Variables.columnasSolicitud.Author,
            Variables.columnasSolicitud.TipoDocumento,
            Variables.columnasSolicitud.TipoProducto,
            Variables.columnasSolicitud.Estado,
            Variables.columnasSolicitud.Moneda,
            Variables.columnasSolicitud.ModalidadPago,
            Variables.columnasSolicitud.Zona,
            Variables.columnasSolicitud.Oficina,
            Variables.columnasSolicitud.SustentoIngreso,
        ];

        const uniques = [...new Set(campos)];
        return uniques;
    }

    public static parseJson(elemento: any): EBandejaSolicitud {
        const item = new EBandejaSolicitud();

        item.Id = SPParse.getNumber(elemento[Variables.columnasSolicitud.ID]);
        item.Title = SPParse.getString(elemento[Variables.columnasSolicitud.Title]);
        item.Author = User.parseJson(elemento[Variables.columnasSolicitud.Author]).Title;
        item.Created = SPParse.getDate(elemento[Variables.columnasSolicitud.Created]);
        item.NombreTitular = SPParse.getString(elemento[Variables.columnasSolicitud.NombreTitular]);
        item.TipoDocumento = Lookup.parseJson(elemento[Variables.columnasSolicitud.TipoDocumento]).Title;
        item.NumeroDocumento = SPParse.getString(elemento[Variables.columnasSolicitud.NumeroDocumento]);
        item.TipoProducto = Lookup.parseJson(elemento[Variables.columnasSolicitud.TipoProducto]).Title;
        item.Estado = Lookup.parseJson(elemento[Variables.columnasSolicitud.Estado]).Title;
        item.Moneda = Lookup.parseJson(elemento[Variables.columnasSolicitud.Moneda]).Title;
        item.PrecioVenta = SPParse.getString(elemento[Variables.columnasSolicitud.PrecioVenta]);
        item.ModalidadPago = Lookup.parseJson(elemento[Variables.columnasSolicitud.ModalidadPago]).Title;
        item.Financiamiento = SPParse.getString(elemento[Variables.columnasSolicitud.Financiamiento]);
        item.Zona = Lookup.parseJson(elemento[Variables.columnasSolicitud.Zona]).Title;
        item.Oficina = Lookup.parseJson(elemento[Variables.columnasSolicitud.Oficina]).Title;
        item.SustentoIngreso = Lookup.parseJson(elemento[Variables.columnasSolicitud.SustentoIngreso]).Title;
        item.FechaEstado = SPParse.getDate(elemento[Variables.columnasSolicitud.FechaEstado]);

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