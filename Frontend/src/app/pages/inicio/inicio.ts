import { Component, signal, ViewChild } from '@angular/core';
import { Publicar } from '../../components/usuarios/publicar/publicar';
import { Muro } from '../../components/usuarios/muro/muro';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [Publicar, Muro, Navbar],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  // Obtenemos una referencia al componente muro para poder refrescarlo
  @ViewChild(Muro) componenteMuro!: Muro;

  isDarkMode = signal<boolean>(true);
  respuestaExito = signal<{ id: string, expira_en: string } | null>(null);
  errorMsg = signal<string | null>(null);

  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }

  manejarMensajePublicado(datos: { id: string, expira_en: string }): void {
    this.errorMsg.set(null);
    this.respuestaExito.set(datos);
    
    // 🔄 ¡MAGIA DE AUTOMATIZACIÓN! Cuando el hijo publica con éxito, 
    // le ordenamos al muro que se vuelva a consultar en la DB de inmediato.
    if (this.componenteMuro) {
      this.componenteMuro.cargarMuro();
    }
  }
}