import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  @Input() public movieId!: string;

  ngOnInit() {
    console.log('MovieComponent initialized with movieId:', this.movieId);
  }
}
