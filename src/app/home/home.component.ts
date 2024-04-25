import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Movie, TMDBApiResponse } from '../core/types/tmdb-api.type';
import {
  debounceTime,
  distinct,
  filter,
  fromEvent,
  map,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MoviesService } from '../core/services/movies.service';
import { CardMovieComponent } from '../card-movie/card-movie.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardMovieComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('movieSearchInput', { static: true })
  private movieSearchInput!: ElementRef;

  public movies: Movie[] = [];
  private destroy$ = new Subject<void>();

  constructor(private movieService: MoviesService) {}

  ngOnInit(): void {
    this.onSearchMovie();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onSearchMovie() {
    fromEvent<Event>(this.movieSearchInput.nativeElement, 'keyup')
      .pipe(
        takeUntil(this.destroy$),
        map((event: Event) => {
          const searchTerm = (event.target as HTMLInputElement).value;
          return searchTerm;
        }),
        filter((searchTerm: string) => searchTerm.length > 3),
        debounceTime(500),
        distinct(),
        switchMap((searchTerm: string) =>
          this.movieService.getMovies({ title: searchTerm, page: 1 })
        )
      )
      .subscribe((response) => {
        this.movies = response?.results !== undefined ? response.results : [];
      });
  }
}
