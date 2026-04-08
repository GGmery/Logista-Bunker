import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TabsPage,
        children: [
          {
            path: 'items',
            loadChildren: () => import('../items/items.module').then(m => m.ItemsPageModule)
          },
          {
            path: 'categories',
            loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
          },
          {
            path: '',
            redirectTo: 'items',
            pathMatch: 'full'
          }
        ]
      }
    ])
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
