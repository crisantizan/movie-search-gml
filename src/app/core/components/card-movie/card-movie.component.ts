import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../types/tmdb-api.type';
import { MoviesService } from '../../services/movies.service';
import { Router } from '@angular/router';

const MAX_LENGTH = 40;

@Component({
  selector: 'app-card-movie',
  standalone: true,
  templateUrl: './card-movie.component.html',
  styleUrls: ['./card-movie.component.css'],
})
export class CardMovieComponent {
  @Input('movie') movie!: Movie;

  constructor(private movieService: MoviesService, private router: Router) {}

  getImage() {
    return this.movieService.getImageUrl(this.movie.poster_path);
  }

  goToMovie() {
    this.router.navigate(['/movie', this.movie.id]);
  }

  get truncateOverview(): string {
    const str = this.movie.overview;
    if (str.length <= MAX_LENGTH) {
      return str;
    } else {
      return str.slice(0, MAX_LENGTH - 1) + '...';
    }
  }
}
