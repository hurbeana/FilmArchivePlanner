import { Pipe, PipeTransform } from '@angular/core';


function parseNum(SECONDS: any): string {
    return new Date(SECONDS * 1000).toISOString().substring(11, 19)
}

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
  transform(value: any | undefined, format = 'default'): any {
    if (value === undefined) {
      return '';
    }
    if (format === 'default') {
      if (typeof value === "string" || value instanceof String) {
        if(value.includes(':')) {
          var arr = value.split(':');
          return Number(arr[0]) * 3600 + Number(arr[1]) * 60 + Number(arr[2]);
        }
        return parseNum(value);
      }
      else if (typeof value === 'number' || value instanceof Number) {
        return parseNum(value);
      }
      return value;
    } else {
      // other formats
      return value.toString();
    }
  }
}