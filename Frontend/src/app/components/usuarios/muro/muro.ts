import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensajeMuro, UsuarioService } from '../../../services/usuarios';

@Component({
  selector: 'app-muro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muro.html',
  styleUrl: './muro.css'
})
export class Muro implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  // Recibe el estado del tema desde el padre de forma reactiva
  isDarkMode = input<boolean>(true);

  // Estados reactivos con Signals para la interfaz
  mensajes = signal<MensajeMuro[]>([]);
  cargando = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarMuro();
  }

  // Llama al endpoint GET de tu servicio integrado
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
}