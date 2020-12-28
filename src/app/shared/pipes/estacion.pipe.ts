import { Pipe, PipeTransform } from '@angular/core';
import { GeneralListService } from '../services/general-list.service';
import { Variables } from '../variables';

@Pipe({
  name: 'estacion'
})
export class EstacionPipe implements PipeTransform {
  constructor(
    private generalListService: GeneralListService
  ){

  }
  async transform(value: number, ...args: unknown[]) {
    let title = '';
    if (value) {
      return title = await this.getEstacion(value);
    } else {
      return title = 'SIN ESTADO';
    }
  }

  async getEstacion(idEstacion: number){
    let estacion = '';
    estacion = await this.generalListService.getItemById(Variables.listas.AdmEstado, idEstacion)
     .then((estacionList: any) => estacionList.Title)
     .catch(error => console.error(error));
    return estacion;
  }

}
