import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() pageRange: number = 5;

  public previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  public nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  public goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  public getDisplayedPages() {
    const displayedPages = [];
    const start = Math.max(1, this.currentPage - this.pageRange);
    const end = Math.min(this.totalPages, this.currentPage + this.pageRange);

    // Añadir botón para la primera página
    if (this.currentPage - this.pageRange > 1) {
      displayedPages.push(1);
    }

    // Añadir botones para páginas anteriores alrededor de la página actual
    for (let i = start; i < this.currentPage; i++) {
      displayedPages.push(i);
    }

    // Añadir página actual
    displayedPages.push(this.currentPage);

    // Añadir botones para páginas posteriores alrededor de la página actual
    for (let i = this.currentPage + 1; i <= end; i++) {
      displayedPages.push(i);
    }

    // Añadir botón para la última página
    if (this.currentPage + this.pageRange < this.totalPages) {
      displayedPages.push(this.totalPages);
    }

    return displayedPages;
  }

  public showPagination() {
    return this.totalPages > 1;
  }

  public abs(num: number) {
    return Math.abs(num);
  }
}
