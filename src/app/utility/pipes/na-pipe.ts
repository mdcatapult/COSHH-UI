import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'NA' })
export class NAPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';
        if (value.toUpperCase() === 'N/A' || value.toUpperCase() === 'NA') {
            return 'N/A';
        } else return value;
    }
}