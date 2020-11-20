import { v4 as uuidv4 } from 'uuid';
import { MaestroLinea } from './models/fisics/MaestroLinea';

export const Funciones = {
    getMonth: (month: number) => {
        let monthString = '';

        switch (month) {
            case 1: monthString = 'Enero'; break;
            case 2: monthString = 'Febrero'; break;
            case 3: monthString = 'Marzo'; break;
            case 4: monthString = 'Abril'; break;
            case 5: monthString = 'Mayo'; break;
            case 6: monthString = 'Junio'; break;
            case 7: monthString = 'Julio'; break;
            case 8: monthString = 'Agosto'; break;
            case 9: monthString = 'Septiembre'; break;
            case 10: monthString = 'Octubre'; break;
            case 11: monthString = 'Noviembre'; break;
            case 12: monthString = 'Diciembre'; break;
        }

        return monthString;
    },
    getFechaActualFormatoDDMMYYYY: (): string => Funciones.dateFormat( new Date() ),
    dateFormat: (date: Date): string => `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`,
    replaceAll: (cadena: string, search: string, replace: string): string => {
        while (cadena.indexOf(search) > -1) {
            cadena = cadena.replace( search, replace);
        }
        return cadena;
    },
    deleteCharacters: (cadena: string, characters: string[]): string => {
        characters.forEach( 
            character => {
                cadena = Funciones.replaceAll(cadena, character, '');
            }
        );

        return cadena;
    },
    getExtensionOfFileName: (fileName: string): string => {
        const extension = fileName.split('.');
        return extension[extension.length - 1];
    },
    generateRandomUniqueName: (noCharacterEspecial = true): string => {
        const randomName = uuidv4() + Funciones.getFechaActualFormatoDDMMYYYY();
        return noCharacterEspecial ? Funciones.deleteCharacters( randomName, ['-', '/'] ) : randomName;
    },
    excelBorde: (): {} => ({ top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }),
    BetWeen: (num: number, from: number, to: number): boolean => num >= from && num <= to,
    validaNuevaSolicitud: (maestroLinea: MaestroLinea[], IdUsuario: number): boolean => 
                            maestroLinea.filter( linea => linea.LAB.Id === IdUsuario ).length > 0,
    format: (format: number, value: string): string => {
        const length = value.length;
        if (length < format) {
            for (let index = 0; index < (format - length); index++) {
                value = `0${value}`;                
            }
        }

        return value;
    }
};
