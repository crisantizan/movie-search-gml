import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TMDBApiResponse } from '../types/tmdb-api.type';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly API_KEY = environment.tmdbApiKey;
  private readonly API_URL = environment.tmdbApiUrl;

  constructor(private readonly httpClient: HttpClient) {}

  private getHeaders() {
    return {
      accept: 'application/json',
      Authorization: `Bearer ${this.API_KEY}`,
    };
  }

  public getMoviesByTitle(title: string, page: number) {
    const params = {
      query: title,
      include_adult: 'false',
      language: 'es-CO',
      page: page.toString(),
    };

    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.API_URL}/search/movie?${queryParams}`;

    return this.httpClient.get<TMDBApiResponse>(url, {
      headers: this.getHeaders(),
    });
  }
}
