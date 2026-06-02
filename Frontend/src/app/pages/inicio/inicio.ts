import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajePayload, UsuarioService } from '../../services/usuarios';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.html', // <-- Enlace al archivo HTML separado
  styleUrl: './inicio.css'      // Opcional, por si necesitas estilos específicos aquí
})
export class Inicio {
  // Inyección del servicio de Angular
  private readonly adminService = inject(UsuarioService);

  // Estados reactivos con Signals
  contenido = signal<string>('');
  horasVisibilidad = signal<number>(1);
  cargando = signal<boolean>(false);
  
  respuestaExito = signal<{ id: string, expira_en: string } | null>(null);
  errorMsg = signal<string | null>(null);

  // Escucha los cambios del slider de rango
  actualizarHoras(event: Event): void {
    const elemento = event.target as HTMLInputElement;
    this.horasVisibilidad.set(Number(elemento.value));
  }

  // Envío del payload al Backend
  enviarMensaje(): void {
    if (!this.contenido().trim()) return;

    this.cargando.set(true);
    this.errorMsg.set(null);
    this.respuestaExito.set(null);

    // TODO: Manejar este sesion_id de forma dinámica según tu lógica de sesión anónima
    const payload: MensajePayload = {
      sesion_id: 'e69a8b66-0797-4b95-bc67-0c60f2bb9da1', 
      contenido: this.contenido().trim(),
      horas_visibilidad: this.horasVisibilidad()
    };

    this.adminService.publicarMensaje(payload).subscribe({
      next: (res) => {
        this.respuestaExito.set({
          id: res.id,
          expira_en: res.expira_en
        });
        this.contenido.set(''); // Limpiamos la caja de texto
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