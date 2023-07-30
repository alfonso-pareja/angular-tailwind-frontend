import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CLPCurrencyPipe'
})
export class CLPCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    const formattedValue = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);

    return formattedValue;
  }
}
