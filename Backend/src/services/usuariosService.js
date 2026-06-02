import { adminModel } from '../models/usuariosModel.js';
import crypto from 'crypto';

export const adminService = {
    subirMensaje: async ({ sesion_id, contenido, horas_visibilidad }) => {
        // 1. Generar el UUID v4 para el mensaje
        const id = crypto.randomUUID();
        const horas = horas_visibilidad || 1;

        // 2. Calcular la fecha exacta de expiración para MySQL
        const fecha_actual = new Date();
        fecha_actual.setHours(fecha_actual.getHours() + horas);
        const expira_en = fecha_actual.toISOString().slice(0, 19).replace('T', ' ');

        // 3. Insertar mediante el objeto del modelo
        await adminModel.crearMensaje({
            id,
            sesion_id,
            contenido,
            expira_en,
            horas_visibilidad: horas
        });

        return { id, estado: 'Mensaje publicado exitosamente', expira_en };
    }
};