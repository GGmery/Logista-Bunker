import { Component, OnInit } from '@angular/core';
import { ItemService, Item } from '../services/item.service';
import { CategoryService, Category } from '../services/category.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.page.html',
  styleUrls: ['./item-form.page.scss']
})
export class ItemFormPage implements OnInit {
  item: Partial<Item> = { quantity: 1 };
  categories: Category[] = [];
  isEdit = false;

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getAll();
  }

  async save() {
    if (this.item.name && this.item.category_id) {
      if (this.isEdit && this.item.id) {
        await this.itemService.update(this.item as Item);
      } else {
        await this.itemService.add(this.item as Item);
      }
      this.navCtrl.back();
    }
  }
}
