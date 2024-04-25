import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration',
  standalone: true,
})
export class FormatDurationPipe implements PipeTransform {
  transform(value: number | null): string {
    if (!value) {
      return '';
    }

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    const formattedHours = this.formatHours(hours);

    return `${formattedHours}${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }

  private formatHours(hours: number): string {
    return hours > 0 ? `${hours} hora${hours > 1 ? 's' : ''} y ` : '';
  }
}
