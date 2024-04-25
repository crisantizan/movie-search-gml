import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  MovieDetails,
  SearchArgs,
  TMDBApiResponse,
} from '../types/tmdb-api.type';
import { SearchMovieParams } from '../types/movies-service.type';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly API_ACCESS_TOKEN = environment.tmdbAccessToken;
  private readonly API_URL = environment.tmdbApiUrl;

  constructor(private readonly httpClient: HttpClient) {}

  private getHeaders() {
    return {
      accept: 'application/json',
      Authorization: `Bearer ${this.API_ACCESS_TOKEN}`,
    };
  }

  public getMovies(args: SearchArgs) {
    const params: SearchMovieParams = {
      include_adult: 'false',
      language: 'es-CO',
      page: args.page?.toString() || '1',
    };

    if (args.title) {
      params.query = args.title;
    }

    let url = `${this.API_URL}/search/movie`;

    if (args.trending) {
      url = `${this.API_URL}/trending/movie/day`;
    }

    const queryParams = new URLSearchParams(params).toString();
    url += `?${queryParams}`;

    return this.httpClient.get<TMDBApiResponse>(url, {
      headers: this.getHeaders(),
    });
  }

  public getMovieById(id: number) {
    const url = `${this.API_URL}/movie/${id}`;

    return this.httpClient.get<MovieDetails>(url, {
      headers: this.getHeaders(),
    });
  }

  public getImageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w400${path}`;
  }
}
