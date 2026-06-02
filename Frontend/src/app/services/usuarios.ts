import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

// Interfaz para tipar los datos que requiere tu backend
export interface MensajePayload {
  sesion_id?: string;
  contenido?: string;
  horas_visibilidad?: number;
}

// Interfaz para la respuesta que devuelve tu backend
export interface MensajeResponse {
  id: string;
  estado: string;
  expira_en: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Inyección moderna de dependencias
  private readonly http = inject(HttpClient);
  
  // Construcción de la ruta madre obtenida desde el environment
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  publicarMensaje(payload: MensajePayload): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(`${this.baseUrl}/mensaje`, payload);
  }
}