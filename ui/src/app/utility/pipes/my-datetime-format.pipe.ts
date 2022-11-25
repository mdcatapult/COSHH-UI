import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'DateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    return moment(value).format('DD-MM-YYYY');
  }
}
