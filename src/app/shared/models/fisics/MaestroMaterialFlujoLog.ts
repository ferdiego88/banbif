// export interface MaestroMaterialFlujoLog {
//     MaestroFlujoEtapa: string;
//     Comentarios: string;
//     Creado: string;
//     CreadoPor: string;
// }

import { ListItem } from './base/ListItem';
import { Variables } from 'src/app/shared/variables';

export class MaestroMaterialFlujoLog extends ListItem {

    constructor(
        MaestroFlujoEtapa = '',
        Comentarios = '',
        Creado = Date(),
        CreadoPor = '' 
    ) {
        super();
    }

    public static getColumnasSelect(): string[] {
        return [
            `${Variables.columns.MaestroFlujoEtapa}/${Variables.columns.Title}`,
            Variables.columns.Creado,
            `${Variables.columns.CreadoPor}/${Variables.columns.Title}`,
            `${Variables.columns.CreadoPor}/${Variables.columns.Id}`,
            Variables.columns.EnBorrador,
            '*'
        ];
    }

    public static getColumnasExpand(): string[] {
        return [
            Variables.columns.MaestroFlujoEtapa,
            Variables.columns.CreadoPor
        ];
    }
}