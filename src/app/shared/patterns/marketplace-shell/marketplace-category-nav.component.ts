import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '@app/models/category.model';
import { StorefrontCategoryService } from '@app/services/storefront/storefront-category.service';

@Component({
  selector: 'sh-marketplace-category-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './marketplace-category-nav.component.html',
  styleUrl: './marketplace-category-nav.component.scss',
})
export class MarketplaceCategoryNavComponent implements OnInit {
  private readonly categoryService = inject(StorefrontCategoryService);

  categories: Category[] = [];

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: res => {
        this.categories = res?.data?.data ?? [];
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  get visibleCategories(): Category[] {
    return this.categories.slice(0, 8);
  }
}
