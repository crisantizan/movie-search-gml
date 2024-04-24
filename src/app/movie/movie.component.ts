import { Component, Input } from '@angular/core';
import { MoviesService } from '../core/services/movies.service';
@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  @Input() public movieId!: string;

  constructor(
    // private readonly route: ActivatedRoute,
    private readonly moviesService: MoviesService
  ) {}

  ngOnInit() {
    this.moviesService
      .getMovies({
        title: this.movieId,
        page: 1,
      })
      .subscribe((results) => {
        console.log(results);
      });
  }
}
