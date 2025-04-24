import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'utcDate' })
export class UtcDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(`${value}T00:00:00Z`);
    return date.toISOString().split('T')[0];
  }
}
