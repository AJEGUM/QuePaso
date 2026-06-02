import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isDarkMode = input<boolean>(true);
  respuestaExito = input<any | null>(null);
  errorMsg = input<string | null>(null);
  onToggleTheme = output<void>();
}
