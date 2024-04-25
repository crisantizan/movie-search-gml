import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../core/types/tmdb-api.type';
import { MoviesService } from '../core/services/movies.service';

const MAX_LENGTH = 40;

@Component({
  selector: 'app-card-movie',
  standalone: true,
  templateUrl: './card-movie.component.html',
  styleUrls: ['./card-movie.component.css']
})

export class CardMovieComponent implements OnInit {
  @Input('movie') movie!: Movie;

  constructor(private movieService: MoviesService) { }

  ngOnInit(): void {
  }

  getImage() {
    return this.movieService.getImageUrl(this.movie.poster_path);
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
