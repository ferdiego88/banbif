import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanString'
})
export class BooleanStringPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): unknown {
    return value ? 'Sí' : 'No';
  }

}
