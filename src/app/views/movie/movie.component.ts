import { Component, Input } from '@angular/core';
import { MoviesService } from '../../core/services/movies.service';
import { MovieDetails } from '../../core/types/tmdb-api.type';
import { Location } from '@angular/common';
import { FormatDatePipe } from '../../core/pipes/format-date/format-date.pipe';
import { FormatDurationPipe } from '../../core/pipes/format-duration/format-duration.pipe';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [FormatDatePipe, FormatDurationPipe],
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
