import pool from '../config/dbConfig.js';

export const adminModel = {
    crearMensaje: async ({ id, sesion_id, contenido, expira_en, horas_visibilidad }) => {
        const query = `
            INSERT INTO mensaje (id, sesion_id, contenido, expira_en, horas_visibilidad)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [id, sesion_id, contenido, expira_en, horas_visibilidad]);
        return result;
    }
};