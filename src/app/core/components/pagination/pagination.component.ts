import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input('currentPage') currentPage$ = new BehaviorSubject<number>(1);
  @Input('totalPages') totalPages$ = new BehaviorSubject<number>(1);
  @Input() pageRange: number = 5;

  @Output()
  public pageChange = new EventEmitter<number>();

  public previousPage() {
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);

      this.emitPage();
    }
  }

  public showPageItem(page: number) {
    return (
      page === 1 ||
      page === this.totalPages$.value ||
      this.abs(page - this.currentPage$.value) <= this.pageRange
    );
  }

  public isPrevButtonDisabled() {
    return this.currentPage$.value === 1;
  }

  public isNextButtonDisabled() {
    return this.currentPage$.value === this.totalPages$.value;
  }

  public isCurrentPageItemDisabled(page: number) {
    return page === this.currentPage$.value;
  }

  private emitPage() {
    this.pageChange.emit(this.currentPage$.value);
  }

  public nextPage() {
    if (this.currentPage$.value < this.totalPages$.value) {
      this.currentPage$.next(this.currentPage$.value + 1);

      this.emitPage();
    }
  }

  public goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages$.value) {
      this.currentPage$.next(pageNumber);

      this.emitPage();
    }
  }

  public getDisplayedPages() {
    const displayedPages = [];
    const start = Math.max(1, this.currentPage$.value - this.pageRange);
    const end = Math.min(
      this.totalPages$.value,
      this.currentPage$.value + this.pageRange
    );

    // Añadir botón para la primera página
    if (this.currentPage$.value - this.pageRange > 1) {
      displayedPages.push(1);
    }

    // Añadir botones para páginas anteriores alrededor de la página actual
    for (let i = start; i < this.currentPage$.value; i++) {
      displayedPages.push(i);
    }

    // Añadir página actual
    displayedPages.push(this.currentPage$.value);

    // Añadir botones para páginas posteriores alrededor de la página actual
    for (let i = this.currentPage$.value + 1; i <= end; i++) {
      displayedPages.push(i);
    }

    // Añadir botón para la última página
    if (this.currentPage$.value + this.pageRange < this.totalPages$.value) {
      displayedPages.push(this.totalPages$.value);
    }

    return displayedPages;
  }

  public abs(num: number) {
    return Math.abs(num);
  }
}
