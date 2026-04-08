import { Component, OnInit } from '@angular/core';
import { ItemService, Item } from '../services/item.service';
import { CategoryService, Category } from '../services/category.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss']
})
export class ItemsPage implements OnInit {
  items: Item[] = [];
  categories: Category[] = [];
  filter = '';

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    public themeService: ThemeService
  ) {}

  async ngOnInit() {
    await this.loadItems();
    this.categories = await this.categoryService.getAll();
  }

  async ionViewWillEnter() {
    await this.loadItems();
  }

  async loadItems() {
    this.items = await this.itemService.getAll(this.filter);
  }

  async updateQuantity(item: Item, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty >= 0) {
      await this.itemService.updateQuantity(item.id!, newQty);
      await this.loadItems();
    }
  }

  async deleteItem(id: number) {
    await this.itemService.delete(id);
    await this.loadItems();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get totalUnits(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get lowStockCount(): number {
    return this.items.filter(item => item.quantity < 5).length;
  }
}
