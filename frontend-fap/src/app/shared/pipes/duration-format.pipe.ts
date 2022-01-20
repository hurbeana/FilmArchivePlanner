import { Pipe, PipeTransform } from '@angular/core';
/*
 * Usage:
 *   value | durationFormat:format
 *   value | durationFormat
 * Example:
 *   {{ movie.length | durationFormat:'default' }}
 *   formats to: 1024
 */
@Pipe({ name: 'durationFormat' })
export class DurationFormatPipe implements PipeTransform {
  transform(value: number | undefined, format = 'default'): string {
    if (value === undefined) {
      return '';
    }
    if (format === 'default') {
      return Math.floor(value / 60) + 'h ' + (value % 60) + 'min';
    } else {
      // other formats
      return value.toString();
    }
  }
}
