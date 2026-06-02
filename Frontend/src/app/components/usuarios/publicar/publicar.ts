import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajePayload, UsuarioService } from '../../../services/usuarios';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicar.html',
  styleUrl: './publicar.css',
})
export class Publicar {
  private readonly adminService = inject(UsuarioService);

  // Recibe el tema visual desde el padre
  isDarkMode = input<boolean>(true);

  // NOTIFICA AL PADRE: Emite los datos cuando el mensaje se crea con éxito
  onPublicadoExito = output<{ id: string, expira_en: string }>();

  // Estados locales del formulario aislado
  contenido = signal<string>('');
  horasVisibilidad = signal<number>(1);
  cargando = signal<boolean>(false);

  enviarMensaje(): void {
    if (!this.contenido().trim()) return;

    this.cargando.set(true);

    // Mapeo dinámico directo al payload
    const payload: MensajePayload = {
      contenido: this.contenido().trim(),
      horas_visibilidad: this.horasVisibilidad() // 👈 Enviamos el tiempo real seleccionado por el usuario
    };

    this.adminService.publicarMensaje(payload).subscribe({
      next: (res) => {
        // 1. Notificamos al componente Inicio enviándole la respuesta del backend
        this.onPublicadoExito.emit({
          id: res.id,
          expira_en: res.expira_en
        });
        
        // 2. Limpiamos nuestro estado local
        this.contenido.set(''); 
        this.horasVisibilidad.set(1); // Reseteamos a 1 hora por defecto
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      }
    });
  }

  autoCrescer(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto';
    elemento.style.height = `${elemento.scrollHeight}px`;
  }

  resetearAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto';
  }
}