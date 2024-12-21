import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private theme: string = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  toggleTheme(): void {
    const themeClass = this.theme === 'light' ? 'dark' : 'light';
    this.renderer.removeClass(document.body, this.theme);
    this.renderer.addClass(document.body, themeClass);
    this.theme = themeClass;
    localStorage.setItem('theme', this.theme);

  }

  initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.theme = savedTheme;
    this.renderer.addClass(document.body, savedTheme);
  }

  getTheme(): string {
    return this.theme;
  }
}
