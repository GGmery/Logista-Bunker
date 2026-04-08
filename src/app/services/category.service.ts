import { Injectable } from '@angular/core';
import { DatabaseInitService } from './database-init.service';
import { SQLiteService } from './sqlite.service';

export interface Category {
  id?: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly dbName = 'bunker.db';

  constructor(
    private sqliteService: SQLiteService,
    private databaseInitService: DatabaseInitService
  ) {}

  async getAll(): Promise<Category[]> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    const res = await db.query('SELECT * FROM categories', []);
    return res.values as Category[] || [];
  }

  async add(name: string): Promise<void> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    await db.run('INSERT INTO categories (name) VALUES (?)', [name]);
    await this.sqliteService.saveToStore(this.dbName);
  }

  async delete(id: number): Promise<void> {
    await this.databaseInitService.initializeDatabase();
    const db = await this.sqliteService.openDatabase(this.dbName, false, 'no-encryption', 1, false);
    await db.run('DELETE FROM categories WHERE id = ?', [id]);
    await this.sqliteService.saveToStore(this.dbName);
  }
}
