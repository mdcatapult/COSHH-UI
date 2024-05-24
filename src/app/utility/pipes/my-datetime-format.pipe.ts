import moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    return value ? moment(value).format('DD-MM-YYYY') : '';
  }
}
