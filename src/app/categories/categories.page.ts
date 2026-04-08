import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../services/category.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  newCategory = '';

  constructor(
    private categoryService: CategoryService,
    public themeService: ThemeService
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

  async addCategory() {
    if (this.newCategory.trim()) {
      await this.categoryService.add(this.newCategory.trim());
      this.newCategory = '';
      await this.loadCategories();
    }
  }

  async deleteCategory(id: number) {
    await this.categoryService.delete(id);
    await this.loadCategories();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
