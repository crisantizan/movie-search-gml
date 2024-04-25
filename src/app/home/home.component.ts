import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../core/types/tmdb-api.type';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MoviesService } from '../core/services/movies.service';
import { CardMovieComponent } from '../card-movie/card-movie.component';
import {
  Pagination,
  RouteQueryParams,
} from '../core/types/home-component.type';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GenericObject } from '../core/types/global.type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CardMovieComponent, PaginationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  public searchTitle: string = '';
  public searchTitleChange$ = new Subject<string>();

  public movies: Movie[] = [];

  public currentPage$ = new BehaviorSubject<number>(1);
  public totalPages$ = new BehaviorSubject<number>(0);

  private defaultMovies: Movie[] = [];
  private defaultPagination: Pagination = {
    currentPage: 1,
    totalPages: 0,
    // totalResults: 0,
  };

  // La API solo permite un máximo de 500 páginas
  private readonly MAX_PAGES = 500;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly movieService: MoviesService
  ) {}

  ngOnInit(): void {
    this.getDefaultMovies();
    this.manageInitialQueryParams();

    this.onSearchMovie();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private manageInitialQueryParams() {
    let { page, title } = this.route.snapshot.queryParams;

    if (isNaN(page)) {
      page = 1;
    }

    if (page > this.MAX_PAGES) {
      page = this.MAX_PAGES;
    }

    if (page < 1) {
      page = 1;
    }

    if (title) {
      this.searchTitle = title;
    }

    this.updatePageQueryParams({ title });
    this.onPageChange(page);
  }

  private updatePageQueryParams(params: Partial<RouteQueryParams>) {
    const queryParams: GenericObject = {};

    if (typeof params.title !== 'undefined') {
      queryParams['title'] = params.title || null;
    }

    if (typeof params.page !== 'undefined') {
      queryParams['page'] = params.page || null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private getDefaultMovies() {
    if (!!this.defaultMovies.length) {
      return;
    }

    this.movieService.getMovies({ trending: true }).subscribe((res) => {
      this.defaultMovies = res.results || [];

      this.defaultPagination = {
        currentPage: res.page,
        totalPages: this.getTotalPages(res.total_pages),
      };
    });
  }

  private onSearchMovie() {
    this.searchTitleChange$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTitle) => {
          this.updatePageQueryParams({
            title: searchTitle,
            page: 1,
          });

          if (!searchTitle) {
            return of({
              results: this.defaultMovies,
              page: this.defaultPagination.currentPage,
              total_pages: this.defaultPagination.totalPages,
            });
          }

          return this.movieService.getMovies({ title: searchTitle });
        })
      )
      .subscribe((response) => {
        this.movies = response?.results || [];

        this.currentPage$.next(response.page);
        this.totalPages$.next(this.getTotalPages(response.total_pages));
      });
  }

  private getTotalPages(apiTotalPages: number): number {
    // La API dice que tiene más de 1000 páginas, pero no es cierto, máximo 500
    // Esto bota: Invalid page: Pages start at 1 and max at 500

    return Math.min(apiTotalPages, 500);
  }

  public onChangeSearchInput(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    this.searchTitleChange$.next(searchText);
  }

  public onPageChange(page: number) {
    const title = this.searchTitle;

    const filter = {
      page,
      title,
      trending: title.length === 0,
    };

    this.movieService.getMovies(filter).subscribe((response) => {
      this.movies = response.results || [];

      const totalPages = this.getTotalPages(response.total_pages);
      const page = response.page > totalPages ? totalPages : response.page;

      this.currentPage$.next(page);
      this.totalPages$.next(this.getTotalPages(response.total_pages));

      this.updatePageQueryParams({ page });
    });
  }
}
