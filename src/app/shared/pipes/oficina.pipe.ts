import { Pipe, PipeTransform } from '@angular/core';
import { GeneralListService } from '../services/general-list.service';
import { Variables } from '../variables';
import { TipoProductoModel } from '../models/fisics/TipoProducto.model';

@Pipe({
  name: 'oficina'
})
export class OficinaPipe implements PipeTransform {
  oficinaList: TipoProductoModel [];
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
    this.oficinaList = [];
    this.oficinaList = await this.generalListService.get(Variables.listas.AdmOficina)
    .then(oficinaList => oficinaList)
    .catch(error => console.error(error));
    const oficina =  this.oficinaList.find(item => item.Id === idOficina).Title;
    return oficina;
  }

}
