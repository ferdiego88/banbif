import { Pipe, PipeTransform } from '@angular/core';
import { MasterService } from '../services/master.service';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  
  constructor(
    private masterService: MasterService
  ){
  }

  transform(value: string, ...args: unknown[]): unknown {
    return this.masterService.dateFormat( new Date(value) );
  }

}
