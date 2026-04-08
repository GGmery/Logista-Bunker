import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
import { Task } from '../models/task';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    public tasks: Task[] = [];
    private db!: SQLiteDBConnection;
    private readonly DB_NAME = 'tasks_db';

    constructor(private sqliteService: SQLiteService) { }

    /**
     * Initializes the plugin, opens the database, and creates the table.
     */
    async initializeFull() {
        // 1. Initialize SQLite plugin
        await this.sqliteService.initializePlugin();

        // 2. Initialize web store if on web platform
        if (this.sqliteService.platform === 'web') {
            await this.sqliteService.initWebStore();
        }

        // 3. Open the database (creates it if it doesn't exist)
        this.db = await this.sqliteService.openDatabase(this.DB_NAME, false, 'no-encryption', 1, false);

        // 4. Create tasks table if it doesn't exist
        const sqlCreateTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      );`;

        await this.db.execute(sqlCreateTable);

        // 5. Load initial tasks
        await this.loadTasks();
    }

    async loadTasks() {
        const res = await this.db.query('SELECT * FROM tasks');
        this.tasks = (res.values as any[]).map(t => ({
            id: t.id,
            title: t.title,
            completed: t.completed === 1
        }));
    }

    async addTask(title: string) {
        const sql = 'INSERT INTO tasks (title, completed) VALUES (?, ?)';
        await this.db.run(sql, [title, 0]);
        await this.saveAndRefresh();
    }

    async updateTask(item: Task) {
        const sql = 'UPDATE tasks SET title = ?, completed = ? WHERE id = ?';
        await this.db.run(sql, [item.title, item.completed ? 1 : 0, item.id]);
        await this.saveAndRefresh();
    }

    async deleteTask(id: number) {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        await this.db.run(sql, [id]);
        await this.saveAndRefresh();
    }

    /**
     * Syncs database to browser storage (IndexedDB) on web platform
     */
    private async saveAndRefresh() {
        if (this.sqliteService.platform === 'web') {
            await this.sqliteService.sqliteConnection.saveToStore(this.DB_NAME);
        }
        await this.loadTasks();
    }
}
