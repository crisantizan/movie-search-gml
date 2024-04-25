import { Component, Input } from '@angular/core';
import { MoviesService } from '../../core/services/movies.service';
import { MovieDetails } from '../../core/types/tmdb-api.type';
import { Location } from '@angular/common';
import { FormatDatePipe } from '../../core/pipes/format-date.pipe';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [FormatDatePipe],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  @Input() public movieId!: string;
  public movie!: MovieDetails;

  constructor(
    private readonly moviesService: MoviesService,
    private readonly location: Location
  ) {}

  ngOnInit() {
    if (!this.movieId) {
      return;
    }

    this.getMovie();
  }

  getMovie() {
    return this.moviesService
      .getMovieById(Number(this.movieId))
      .subscribe((movie) => {
        this.movie = movie;
      });
  }

  get getDuration() {
    const minutes = this.movie.runtime || 0;

    if (minutes <= 0) {
      return '0 Horas';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let result = '';

    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    if (remainingMinutes > 0) {
      result += ` ${remainingMinutes} minute${
        remainingMinutes !== 1 ? 's' : ''
      }`;
    }

    return result.trim();
  }

  get backdropUrl() {
    if (this.movie.backdrop_path && this.movie) {
      return this.moviesService.getImageUrl(this.movie.backdrop_path);
    }

    return '';
  }

  public goBack() {
    this.location.back();
  }
}
