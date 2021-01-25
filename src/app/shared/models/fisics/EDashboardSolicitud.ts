import { User } from './base/User';
import { Lookup } from './base/Lookup';
import { Variables, SPParse } from '../../variables';

export class EDashboardSolicitud {
    Id: number;
    Author: string;
    Created: Date;
    Nombre_Titular: string;
    Fecha_Estado: Date;
    EstadoId: number;
    Estado: string;
    Tipo_RentaId: number;
    ZonaId: number;

    constructor() {
        this.Id = 0;
        this.Author = '';
        this.Created = new Date();
        this.Nombre_Titular = '';
        this.Fecha_Estado = new Date();
        this.EstadoId = 0;
        this.Tipo_RentaId = 0;
        this.ZonaId = 0;
    }

    public static getColumnasSelect(): string[] {
        return [
            Variables.columnasDashboard.ID,
            Variables.columnasDashboard.Author + '/' + Variables.columnasDashboard.Title,
            Variables.columnasDashboard.AuthorId,
            Variables.columnasDashboard.Created,
            Variables.columnasDashboard.FechaEstado,
            Variables.columnasDashboard.EstadoId,
            Variables.columnasDashboard.Tipo_RentaId,
            Variables.columnasDashboard.ZonaId,
        ];
    }

    public static getColumnasExpand(): string[] {
        return [
            Variables.columnasSolicitud.Author,
        ];
    }

    
}