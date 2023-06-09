import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateTimeFormat'
})
export class CustomDateTimeFormatPipe implements PipeTransform {

  transform(value: any): any {
    if (value && value !== '0001-01-01T00:00:00') {
      const date = new Date(value);
      const day = this.formatNumber(date.getDate());
      const month = this.formatNumber(date.getMonth() + 1);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '';
  }

  private formatNumber(number: number): string {
    return number < 10 ? '0' + number : number.toString();
  }

}
