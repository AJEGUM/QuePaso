import { Component, inject, input, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensajeMuro, UsuarioService, ReportePayload } from '../../../services/usuarios';

@Component({
  selector: 'app-muro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muro.html',
  styleUrl: './muro.css'
})
export class Muro implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  isDarkMode = input<boolean>(true);

  mensajes = signal<MensajeMuro[]>([]);
  cargando = signal<boolean>(false);
  errorMsg = signal<string | null>(null);
  
  menuAbiertoId = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarMuro();
  }

  cargarMuro(): void {
    this.cargando.set(true);
    this.errorMsg.set(null);

    this.usuarioService.obtenerMuro().subscribe({
      next: (res) => {
        this.mensajes.set(res.mensajes);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudieron cargar los mensajes del muro.');
        this.cargando.set(false);
      }
    });
  }

  alternarMenuOpciones(id: string, evento: Event): void {
    evento.stopPropagation();
    if (this.menuAbiertoId() === id) {
      this.menuAbiertoId.set(null);
    } else {
      this.menuAbiertoId.set(id);
    }
  }

  // Recibe de forma dinámica el motivo exacto disparado desde el HTML
  enviarReporte(mensajeId: string, motivo: 'spam' | 'contenido_explicito' | 'violencia' | 'ilegal' | 'otro'): void {
    this.menuAbiertoId.set(null); // Cerramos el menú inmediatamente

    const payload: ReportePayload = {
      mensaje_id: mensajeId,
      motivo: motivo
    };

    this.usuarioService.reportarMensaje(payload).subscribe({
      next: (res) => {
        alert('Mensaje reportado con éxito. El equipo de administración lo revisará.');
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409) {
          alert('Ya has enviado una denuncia para este mensaje anteriormente.');
        } else {
          alert('Hubo un problema al procesar el reporte.');
        }
      }
    });
  }

  @HostListener('document:click')
  cerrarMenus(): void {
    this.menuAbiertoId.set(null);
  }
}