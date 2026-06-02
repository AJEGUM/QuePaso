import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

// Interfaz para tipar los datos que requiere tu backend al publicar
export interface MensajePayload {
  sesion_id?: string;
  contenido?: string;
  horas_visibilidad?: number;
}

// Interfaz para la respuesta al publicar un mensaje
export interface MensajeResponse {
  id: string;
  estado: string;
  expira_en: string;
}

export interface MensajeMuro {
  id: string;
  contenido: string;
  creado_en: string;
  expira_en: string;
  autor: string;
}

export interface MuroResponse {
  total: number;
  mensajes: MensajeMuro[];
}
export interface ReportePayload {
  mensaje_id: string;
  motivo: 'spam' | 'contenido_explicito' | 'violencia' | 'ilegal' | 'otro';
}
export interface ReporteResponse {
  mensaje: string;
  data: {
    estado: string;
    mensaje_id: string;
  };
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

  obtenerMuro(): Observable<MuroResponse> {
    return this.http.get<MuroResponse>(`${this.baseUrl}/muro`, { withCredentials: true });
  }

  reportarMensaje(payload: ReportePayload): Observable<ReporteResponse> {
    return this.http.post<ReporteResponse>(`${this.baseUrl}/reportar`, payload, { withCredentials: true });
  }
}