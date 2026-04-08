import { Injectable } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'bunker-theme-mode';
  private currentMode: ThemeMode = 'dark';

  initializeTheme(): void {
    const storedTheme = localStorage.getItem(this.storageKey) as ThemeMode | null;
    this.currentMode = storedTheme === 'light' ? 'light' : 'dark';
    this.applyTheme(this.currentMode);
  }

  toggleTheme(): void {
    this.setTheme(this.currentMode === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this.currentMode = mode;
    localStorage.setItem(this.storageKey, mode);
    this.applyTheme(mode);
  }

  isDarkMode(): boolean {
    return this.currentMode === 'dark';
  }

  getMode(): ThemeMode {
    return this.currentMode;
  }

  private applyTheme(mode: ThemeMode): void {
    const body = document.body;
    body.classList.remove('theme-dark', 'theme-light');
    body.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light');
  }
}