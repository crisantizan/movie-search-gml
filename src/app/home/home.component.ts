import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Movie } from '../core/types/tmdb-api.type';
import {
  debounceTime,
  fromEvent,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MoviesService } from '../core/services/movies.service';
import { CardMovieComponent } from '../card-movie/card-movie.component';
import { Pagination } from '../core/types/home-component.type';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardMovieComponent, PaginationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('movieSearchInput', { static: true })
  private movieSearchInput!: ElementRef;

  public movies: Movie[] = [];
  public pagination: Pagination = {
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
  };

  private defaultMovies: Movie[] = [];
  private defaultPagination: Pagination = {
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
  };

  private destroy$ = new Subject<void>();

  constructor(private movieService: MoviesService) {}

  ngOnInit(): void {
    this.getDefaultMovies();

    this.onSearchMovie();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDefaultMovies() {
    if (!!this.defaultMovies.length) {
      this.movies = [...this.defaultMovies];
      this.pagination = { ...this.defaultPagination };

      return;
    }

    this.movieService.getMovies({ trending: true }).subscribe((res) => {
      this.defaultMovies = res.results || [];
      this.movies = [...this.defaultMovies];

      this.defaultPagination = {
        currentPage: res.page,
        totalPages: res.total_pages,
        totalResults: res.total_results,
      };

      this.pagination = { ...this.defaultPagination };
    });
  }

  private onSearchMovie() {
    fromEvent<Event>(this.movieSearchInput.nativeElement, 'keyup')
      .pipe(
        takeUntil(this.destroy$),
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        switchMap((searchTerm: string) => {
          // Return default movies if search term is empty
          if (searchTerm.length === 0) {
            return of({
              results: this.defaultMovies,
              page: this.defaultPagination.currentPage,
              total_pages: this.defaultPagination.totalPages,
              total_results: this.defaultPagination.totalResults,
            });
          }

          return this.movieService.getMovies({ title: searchTerm });
        })
      )
      .subscribe((response) => {
        this.movies = response?.results || [];
        this.pagination = {
          currentPage: response.page,
          totalPages: response.total_pages,
          totalResults: response.total_results,
        };
      });
  }

  public formatQuantityResults(): string {
    return new Intl.NumberFormat().format(this.pagination.totalResults);
  }
}
