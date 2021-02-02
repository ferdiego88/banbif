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
    OficinaId: number;
    MesSolicitud: number;
    Contador_ObservCPM: number;
    Contador_ObservRiesgos: number;
    ContadorObs_Gestor: number;
    Contador_ObservData: number;

    constructor() {
        this.Id = 0;
        this.Author = '';
        this.Created = new Date();
        this.Nombre_Titular = '';
        this.Fecha_Estado = new Date();
        this.EstadoId = 0;
        this.Tipo_RentaId = 0;
        this.ZonaId = 0;
        this.MesSolicitud = 0;
        this.OficinaId = 0;
        this.Contador_ObservCPM = 0;
        this.Contador_ObservRiesgos = 0;
        this.ContadorObs_Gestor = 0;
        this.Contador_ObservData = 0;
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
            Variables.columnasDashboard.OficinaId,
             Variables.columnasDashboard.Contador_ObservCPM,
             Variables.columnasDashboard.Contador_ObservRiesgos,
             Variables.columnasDashboard.ContadorObs_Gestor,
             Variables.columnasDashboard.Contador_ObservData,
        ];
    }

    public static getColumnasExpand(): string[] {
        return [
            Variables.columnasSolicitud.Author,
        ];
    }


}
