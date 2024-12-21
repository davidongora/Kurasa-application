import { ThemeService } from './theme.service';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  providers: [
    // HttpClientModule
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'phonebook_application';

  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 
