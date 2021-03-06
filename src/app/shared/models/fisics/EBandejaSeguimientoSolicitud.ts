import { User } from './base/User';
import { Lookup } from './base/Lookup';
import { Variables, SPParse } from '../../variables';
import * as moment from 'moment';

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
    TiempoAtencion: string;

    constructor() {
        this.Id = 0;
        this.SolicitudHipotecario = "";
        this.Author = "";
        this.Created = new Date();
        this.Estado = "";
        this.Responsable = "";
        this.FechaAtencion = new Date();
        this.EstadoFinal = "";
        this.TiempoAtencion = "";
    }

    public static getColumnasSelect(): string[] {
        return [
            Variables.columnasSeguimiento.ID,
            Variables.columnasSeguimiento.SolicitudHipotecario + '/' + Variables.columnasSeguimiento.ID,
            Variables.columnasSeguimiento.SolicitudHipotecario + '/' + Variables.columnasSeguimiento.Title,
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

        if (item.FechaAtencion !== undefined && item.FechaAtencion !== null) {
            const fechaInicio = new Date(item.Created);
            const fechaAtencion = new Date(item.FechaAtencion);
            item.TiempoAtencion = this.obtenerDuracionAtencion(fechaInicio, fechaAtencion, "9", "18");
        }

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

    static calcularTiempoAtencionDias(startDate: any, endDate: any): string {

        const start = new Date(startDate);
        const end = new Date(endDate);
        const hourStr = moment(startDate).format('HH');
        const hour = parseInt(hourStr, 10);

        let totalBusinessDays = 0;

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const current = new Date(start);
        current.setDate(current.getDate() + 1);

        if (!(hour >= 9 && hour <= 17)) {
            current.setDate(current.getDate() + 1);
        }
        let day;

        while (current <= end) {
            day = current.getDay();
            if (day >= 1 && day <= 5) {
                ++totalBusinessDays;
            }
            current.setDate(current.getDate() + 1);
        }

        console.dir(totalBusinessDays.toString());
        return totalBusinessDays.toString();
    }

    static obtenerDuracionAtencion(fechaHoraDerivacion: Date, fechaHoraAtencion: Date, inicioHorarioOficina: string, finHorarioOficina: string) {

        let duracion = "";
        let totalSegundos: number = 0;
        const horaInicioDia = parseInt(inicioHorarioOficina);
        const horaFinDia = parseInt(finHorarioOficina);
        const horaPorDia = horaFinDia - horaInicioDia;

        const siglaDia = "d";
        const siglaHora = "h";
        const siglaMinuto = "m";
        let dia = 0;
        let hora = 0;
        let minuto = 0;

        let fechaDerivacionSinHora = new Date(fechaHoraDerivacion.getFullYear(), fechaHoraDerivacion.getMonth(), fechaHoraDerivacion.getDate());
        const fechaAtencionSinHora = new Date(fechaHoraAtencion.getFullYear(), fechaHoraAtencion.getMonth(), fechaHoraAtencion.getDate());

        if (fechaDerivacionSinHora.getTime() == fechaAtencionSinHora.getTime()) {
            const fechaHoraMinima = new Date(fechaAtencionSinHora.setHours(horaInicioDia));
            const fechaHoraMaxima = new Date(fechaAtencionSinHora.setHours(horaFinDia));

            if (fechaHoraAtencion > fechaHoraMaxima) {
                fechaHoraAtencion = fechaHoraMaxima;

                if (fechaHoraDerivacion > fechaHoraMaxima) {
                    fechaHoraDerivacion = fechaHoraMaxima;
                    let diff = fechaHoraAtencion.getTime() - fechaHoraDerivacion.getTime();
                    totalSegundos = Math.floor(diff / (1000));
                } else {
                    let diff = fechaHoraAtencion.getTime() - fechaHoraDerivacion.getTime();
                    totalSegundos = Math.floor(diff / (1000));
                }
            }
            else if (fechaHoraAtencion < fechaHoraMinima) {
                fechaHoraAtencion = fechaHoraMaxima;
                let diff = fechaHoraAtencion.getTime() - fechaHoraDerivacion.getTime();
                totalSegundos = Math.floor(diff / (1000));
            }
            else {
                //fechaHoraAtencion = fechaHoraMaxima;
                let diff = fechaHoraAtencion.getTime() - fechaHoraDerivacion.getTime();
                totalSegundos = Math.floor(diff / (1000));
            }
        }
        else {
            let fechaDerivacionInicial = new Date(fechaHoraDerivacion);
            let iteracion = 0;
            while (fechaAtencionSinHora.getTime() >= fechaDerivacionSinHora.getTime()) {
                const fechaHoraMinima = new Date(fechaDerivacionSinHora.setHours(horaInicioDia));
                const fechaHoraMaxima = new Date(fechaDerivacionSinHora.setHours(horaFinDia));

                if (fechaAtencionSinHora.getTime() == fechaDerivacionSinHora.getTime() && fechaHoraAtencion > fechaHoraMaxima) {
                    const diff = fechaHoraMaxima.getTime() - fechaHoraMinima.getTime();
                    totalSegundos += Math.floor(diff / (1000));
                }
                else if (fechaAtencionSinHora.getTime() == fechaDerivacionSinHora.getTime() && fechaHoraAtencion < fechaHoraMinima) {
                    const diff = fechaHoraMinima.getTime() - fechaDerivacionInicial.getTime();
                    totalSegundos += Math.floor(diff / (1000));
                }
                else if (fechaAtencionSinHora.getTime() == fechaDerivacionSinHora.getTime() && fechaHoraMinima <= fechaHoraAtencion && fechaHoraAtencion <= fechaHoraMaxima) {
                    const diff = fechaHoraAtencion.getTime() - fechaHoraMinima.getTime();
                    totalSegundos += Math.floor(diff / (1000));
                }
                else if (fechaHoraDerivacion.getTime() == fechaDerivacionSinHora.getTime()) {
                    const diff = fechaHoraMaxima.getTime() - fechaDerivacionInicial.getTime();
                    totalSegundos += Math.floor(diff / (1000));
                }
                else {

                    if (iteracion === 0) {
                        if (fechaHoraDerivacion > fechaHoraMinima && fechaHoraDerivacion < fechaHoraMaxima) {
                            const diff = fechaHoraMaxima.getTime() - fechaHoraDerivacion.getTime();
                            totalSegundos += Math.floor(diff / (1000));
                        }
                        else if (fechaHoraDerivacion > fechaHoraMaxima){
                            const diff = fechaHoraMaxima.getTime() - fechaHoraMaxima.getTime();
                            totalSegundos += Math.floor(diff / (1000));
                        }
                        else {
                            const diff = fechaHoraMaxima.getTime() - fechaHoraMinima.getTime();
                            totalSegundos += Math.floor(diff / (1000));
                        }
                    } else {
                        let diff = fechaHoraMaxima.getTime() - fechaHoraMinima.getTime();
                        totalSegundos += Math.floor(diff / (1000));
                    }
                }

                fechaDerivacionInicial = new Date(fechaDerivacionInicial.getFullYear(), fechaDerivacionInicial.getMonth(), fechaDerivacionInicial.getDate());
                fechaDerivacionInicial = this.aumentarDias(fechaDerivacionInicial, 1);
                fechaDerivacionInicial = new Date(fechaDerivacionInicial.setHours(horaInicioDia));

                fechaDerivacionSinHora = new Date(fechaDerivacionSinHora.getFullYear(), fechaDerivacionSinHora.getMonth(), fechaDerivacionSinHora.getDate());
                fechaDerivacionSinHora = this.aumentarDias(fechaDerivacionSinHora, 1);

                iteracion++;
            }
        }

        let calculoDias = (totalSegundos / (horaPorDia * 3600));
        const arrayCalculoDias: any[] = calculoDias.toString().split('.');

        if (arrayCalculoDias.length == 1) {
            dia = parseInt(arrayCalculoDias[0]);
        }
        else if (arrayCalculoDias.length > 1) {
            dia = parseInt(arrayCalculoDias[0]);

            let segundosRestantes = (totalSegundos - ((horaPorDia * 3600) * dia));
            const calculoHoras = (segundosRestantes / 3600);
            const arraycalculoHoras: any[] = calculoHoras.toString().split('.');

            if (arraycalculoHoras.length == 1) {
                hora = parseInt(arraycalculoHoras[0]);
            }
            else if (arraycalculoHoras.length > 1) {
                hora = parseInt(arraycalculoHoras[0]);

                segundosRestantes = (segundosRestantes - (hora * 3600));
                const calculoMinutos = (segundosRestantes / 60);
                const arraycalculoMinutos: any[] = calculoMinutos.toString().split('.');
                minuto = parseInt(arraycalculoMinutos[0]);
            }
        }

        if (dia < 0) {
            dia = dia * -1;
        }

        if (hora < 0) {
            hora = hora * -1;
        }

        if (minuto < 0) {
            minuto = minuto * -1;
        }

        duracion = dia + siglaDia + "-" + hora + siglaHora + "-" + minuto + siglaMinuto;

        return duracion;
    }

    static aumentarDias(fecha: Date, dias: number): Date {
        let nrodias = 0;
        for (var i = 1; dias > nrodias; i++) {
            fecha = new Date(fecha.setDate(fecha.getDate() + i));
            var dia = fecha.getDay();
            if (dia !== 6 && dia !== 0) {
                nrodias++;
            }
        }

        return fecha;
    }
}