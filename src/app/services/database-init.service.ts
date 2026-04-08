import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';

@Injectable({ providedIn: 'root' })
export class DatabaseInitService {
  private initPromise?: Promise<void>;
  private readonly dbName = 'bunker.db';
  private readonly resetKey = 'bunker-db-reset-v2';

  constructor(private sqliteService: SQLiteService) {}

  async initializeDatabase(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.runInitialization();
    }

    return this.initPromise;
  }

  private async runInitialization(): Promise<void> {
    // 1. Inicializar el plugin SQLite
    await this.sqliteService.initializePlugin();

    // 2. Inicializar web store si estamos en navegador
    if (this.sqliteService.platform === 'web') {
      await this.sqliteService.initWebStore();

      const shouldReset = !window.localStorage.getItem(this.resetKey);
      if (shouldReset) {
        await this.sqliteService.resetDatabase(this.dbName);
      }
    }

    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    // Create categories table
    await db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );`);
    // Create items table
    await db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      category_id INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );`);
    // Prepopulate categories
    const categories = ['Alimentación', 'Medicinas', 'Herramientas', 'Defensa', 'Energía'];
    for (const name of categories) {
      await db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [name]);
    }
    // Prepopulate items
    await db.run(`DELETE FROM items
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM items
        GROUP BY name, category_id
      );`);
    await db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_items_name_category
      ON items(name, category_id);`);

    const items = [
      { name: 'Agua embotellada', quantity: 24, category: 'Alimentación' },
      { name: 'Comida enlatada', quantity: 14, category: 'Alimentación' },
      { name: 'Raciones MRE', quantity: 7, category: 'Alimentación' },
      { name: 'Botiquín portátil', quantity: 4, category: 'Medicinas' },
      { name: 'Vendas', quantity: 11, category: 'Medicinas' },
      { name: 'Analgésicos', quantity: 3, category: 'Medicinas' },
      { name: 'Linterna', quantity: 2, category: 'Herramientas' },
      { name: 'Cinta americana', quantity: 8, category: 'Herramientas' },
      { name: 'Multiherramienta', quantity: 5, category: 'Herramientas' },
      { name: 'Spray pimienta', quantity: 3, category: 'Defensa' },
      { name: 'Radio de emergencia', quantity: 6, category: 'Defensa' },
      { name: 'Alarma personal', quantity: 9, category: 'Defensa' },
      { name: 'Pilas AA', quantity: 4, category: 'Energía' },
      { name: 'Panel solar portátil', quantity: 2, category: 'Energía' },
      { name: 'Dinamo manual', quantity: 5, category: 'Energía' },
    ];
    for (const item of items) {
      // Get category id
      const res = await db.query('SELECT id FROM categories WHERE name = ?', [item.category]);
      if (res.values && res.values.length > 0) {
        const category_id = res.values[0].id;
        await db.run(
          `INSERT INTO items (name, quantity, category_id)
           VALUES (?, ?, ?)
           ON CONFLICT(name, category_id)
           DO UPDATE SET quantity = excluded.quantity`,
          [item.name, item.quantity, category_id]
        );
      }
    }

    await this.sqliteService.saveToStore(this.dbName);

    if (this.sqliteService.platform === 'web') {
      window.localStorage.setItem(this.resetKey, 'done');
    }
  }
}
