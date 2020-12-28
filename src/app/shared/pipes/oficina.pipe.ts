import { Pipe, PipeTransform } from '@angular/core';
import { GeneralListService } from '../services/general-list.service';
import { Variables } from '../variables';

@Pipe({
  name: 'oficina'
})
export class OficinaPipe implements PipeTransform {
  constructor(
    private generalListService: GeneralListService,
  ){
  }
    async transform(value: number, ...args: unknown[]) {
      let title = '';
      if (value) {
         return title = await this.getOficina(value);
      } else {
        return title = 'SIN OFICINA';
      }
  }
    async getOficina(idOficina: number){
    let oficina = '';
    oficina = await this.generalListService.getItemById(Variables.listas.AdmOficina, idOficina)
    .then((oficinaList: any) => oficinaList.Title)
    .catch(error => console.error(error));
    return oficina;
  }

}
