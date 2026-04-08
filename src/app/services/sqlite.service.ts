import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions
} from '@capacitor-community/sqlite';

@Injectable()
export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;

  constructor() { }

  private normalizeDatabaseName(dbName: string): string {
    return dbName.endsWith('.db') ? dbName.slice(0, -3) : dbName;
  }

  /**
   * Plugin Initialization
   */
  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();
    if (this.platform === 'ios' || this.platform === 'android') this.native = true;
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    this.isService = true;
    return true;
  }

  async initWebStore(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch (err: any) {
      return Promise.reject(`initWebStore: ${err.message || err}`);
    }
  }

  async openDatabase(dbName: string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;
    let isConn = (await this.sqliteConnection.isConnection(dbName, readonly)).result;

    if (retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteConnection
        .createConnection(dbName, encrypted, mode, version, readonly);
    }
    await db.open();
    return db;
  }

  async saveToStore(dbName: string): Promise<void> {
    if (this.platform === 'web') {
      await this.sqliteConnection.saveToStore(this.normalizeDatabaseName(dbName));
    }
  }

  async resetDatabase(dbName: string): Promise<void> {
    const normalizedName = this.normalizeDatabaseName(dbName);

    if (!this.isService) {
      await this.initializePlugin();
    }

    if (this.platform === 'web') {
      await this.initWebStore();
    }

    const isConn = (await this.sqliteConnection.isConnection(normalizedName, false)).result;
    if (isConn) {
      const db = await this.sqliteConnection.retrieveConnection(normalizedName, false);
      await db.close();
      await this.sqliteConnection.closeConnection(normalizedName, false);
    }

    const databaseExists = (await this.sqlitePlugin.isDatabase({ database: normalizedName })).result;
    if (databaseExists) {
      await this.sqlitePlugin.deleteDatabase({ database: normalizedName });
    }
  }

  async addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> {
    await this.sqlitePlugin.addUpgradeStatement(options);
  }
}
