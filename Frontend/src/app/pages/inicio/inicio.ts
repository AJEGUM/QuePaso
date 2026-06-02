import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajePayload, UsuarioService } from '../../services/usuarios';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  // Inyección del servicio de Angular
  private readonly adminService = inject(UsuarioService);

  // Control del tema (True = Oscuro, False = Claro)
  isDarkMode = signal<boolean>(true);

  // Estados reactivos con Signals
  contenido = signal<string>('');
  horasVisibilidad = signal<number>(1); // Se mantiene en 1 por defecto al estar oculto el slider
  cargando = signal<boolean>(false);
  
  respuestaExito = signal<{ id: string, expira_en: string } | null>(null);
  errorMsg = signal<string | null>(null);

  // Alternar entre modo claro y oscuro
  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }

  // Envío del payload al Backend
  enviarMensaje(): void {
    if (!this.contenido().trim()) return;

    this.cargando.set(true);
    this.errorMsg.set(null);
    this.respuestaExito.set(null);

    // Simplificado: El backend asocia automáticamente tu cookie de sesión
    const payload: MensajePayload = {
      contenido: this.contenido().trim(),
      horas_visibilidad: this.horasVisibilidad()
    };

    this.adminService.publicarMensaje(payload).subscribe({
      next: (res) => {
        this.respuestaExito.set({
          id: res.id,
          expira_en: res.expira_en
        });
        this.contenido.set(''); // Limpiamos el input
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo conectar con el servidor. Verifica tu backend.');
        this.cargando.set(false);
      }
    });
  }
}