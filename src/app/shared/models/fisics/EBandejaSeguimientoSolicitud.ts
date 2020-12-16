import { User } from './base/User';
import { Lookup } from './base/Lookup';
import { Variables, SPParse } from '../../variables';

export class EBandejaSeguimientoSolicitud {
    Id: number;
    SolicitudHipotecario: string;
    NombreTitular: string;
    NumeroDocumento: string;
    Author: string;
    Created: Date;
    Estado: string;
    Responsable: string;
    FechaAtencion: Date;
    EstadoFinal: string;

    constructor() {
        this.Id = 0;
        this.SolicitudHipotecario = "";
        this.Author = "";
        this.Created = new Date();
        this.Estado = "";
        this.Responsable = "";
        this.FechaAtencion = new Date();
        this.EstadoFinal = "";
    }

    public static getColumnasSelect(): string[] {
        return [
            Variables.columnasSeguimiento.ID,
            Variables.columnasSeguimiento.SolicitudHipotecario + '/' + Variables.columnasSeguimiento.ID,
            Variables.columnasSeguimiento.NombreTitular,
            Variables.columnasSeguimiento.NumeroDocumento,
            Variables.columnasSeguimiento.Author + '/' + Variables.columnasSeguimiento.Title,
            Variables.columnasSeguimiento.Created,
            Variables.columnasSeguimiento.Estado + '/' + Variables.columnasSeguimiento.Title,
            Variables.columnasSeguimiento.Responsable + '/' + Variables.columnasSeguimiento.Title,
            Variables.columnasSeguimiento.FechaAtencion,
            Variables.columnasSeguimiento.EstadoFinal + '/' + Variables.columnasSeguimiento.Title
        ];
    }

    public static getColumnasExpand(): string[] {
        return [
            Variables.columnasSeguimiento.Author,
            Variables.columnasSeguimiento.SolicitudHipotecario,
            Variables.columnasSeguimiento.Estado,
            Variables.columnasSeguimiento.Responsable,
            Variables.columnasSeguimiento.EstadoFinal
        ];
    }

    public static parseJson(elemento: any): EBandejaSeguimientoSolicitud {
        const item = new EBandejaSeguimientoSolicitud();

        item.Id = SPParse.getNumber(elemento[Variables.columnasSeguimiento.ID]);
        item.Author = User.parseJson(elemento[Variables.columnasSeguimiento.Author]).Title.toUpperCase();
        item.Created = SPParse.getDate(elemento[Variables.columnasSeguimiento.Created]);
        item.SolicitudHipotecario = Lookup.parseJson(elemento[Variables.columnasSeguimiento.SolicitudHipotecario]).Id.toString();
        item.NombreTitular = SPParse.getString(elemento[Variables.columnasSeguimiento.NombreTitular]);
        item.NumeroDocumento = SPParse.getString(elemento[Variables.columnasSeguimiento.NumeroDocumento]);
        item.Estado = Lookup.parseJson(elemento[Variables.columnasSeguimiento.Estado]).Title.toUpperCase();
        item.Responsable = Lookup.parseJson(elemento[Variables.columnasSeguimiento.Responsable]).Title.toUpperCase();
        item.FechaAtencion = SPParse.getDate(elemento[Variables.columnasSeguimiento.FechaAtencion]);
        item.EstadoFinal = Lookup.parseJson(elemento[Variables.columnasSeguimiento.EstadoFinal]).Title.toUpperCase();
        
        return item;
    }

    public static parseJsonList(list: any): EBandejaSeguimientoSolicitud[] {

        let items: EBandejaSeguimientoSolicitud[] = [];

        list.forEach(elemento => {
            const item = EBandejaSeguimientoSolicitud.parseJson(elemento);
            items.push(item);
        });

        return items;
    }
}