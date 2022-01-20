import { Pipe, PipeTransform } from '@angular/core';
/*
 * Usage:
 *   value | durationFormat:format
 *   value | durationFormat
 * Example:
 *   {{ movie.length | durationFormat:'default' }}
 *   {{ movie.length | durationFormat }}
 */
@Pipe({ name: 'durationFormat' })
export class DurationFormatPipe implements PipeTransform {
  transform(value: number | undefined, format = 'default'): string {
    if (value === undefined) {
      return '';
    }
    if (format === 'default') {
      const h = Math.floor(value / 60);
      const min = value % 60;
      return h === 0 ? min + 'min' : h + 'h ' + min + 'min';
    } else {
      // other formats
      return value.toString();
    }
  }
}
