import { Injectable } from '@angular/core';
import { DatabaseInitService } from './database-init.service';
import { SQLiteService } from './sqlite.service';

export interface Item {
  id?: number;
  name: string;
  quantity: number;
  category_id: number;
  category_name?: string;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly dbName = 'bunker.db';

  constructor(
    private sqliteService: SQLiteService,
    private databaseInitService: DatabaseInitService
  ) {}

  async getAll(filter: string = ''): Promise<Item[]> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    let sql = `SELECT items.*, categories.name as category_name FROM items INNER JOIN categories ON items.category_id = categories.id`;
    let params: any[] = [];
    if (filter) {
      sql += ' WHERE items.name LIKE ? OR categories.name LIKE ?';
      params = [`%${filter}%`, `%${filter}%`];
    }
    sql += ' ORDER BY items.id DESC';
    const res = await db.query(sql, params);
    return res.values as Item[] || [];
  }

  async add(item: Item): Promise<void> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    await db.run('INSERT INTO items (name, quantity, category_id) VALUES (?, ?, ?)', [item.name, item.quantity, item.category_id]);
    await this.sqliteService.saveToStore(this.dbName);
  }

  async update(item: Item): Promise<void> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    await db.run('UPDATE items SET name = ?, quantity = ?, category_id = ? WHERE id = ?', [item.name, item.quantity, item.category_id, item.id]);
    await this.sqliteService.saveToStore(this.dbName);
  }

  async delete(id: number): Promise<void> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    await db.run('DELETE FROM items WHERE id = ?', [id]);
    await this.sqliteService.saveToStore(this.dbName);
  }

  async updateQuantity(id: number, quantity: number): Promise<void> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    await db.run('UPDATE items SET quantity = ? WHERE id = ?', [quantity, id]);
    await this.sqliteService.saveToStore(this.dbName);
  }
}
