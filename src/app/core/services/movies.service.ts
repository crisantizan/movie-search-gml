import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SearchArgs, TMDBApiResponse } from '../types/tmdb-api.type';

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
    const params = {
      query: args.title,
      include_adult: 'false',
      language: 'es-CO',
      page: args.page.toString(),
    };

    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.API_URL}/search/movie?${queryParams}`;

    return this.httpClient.get<TMDBApiResponse>(url, {
      headers: this.getHeaders(),
    });
  }

  public getImageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w400${path}`;
  }
}
