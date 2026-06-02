import pool from '../config/dbConfig.js';

export const usuariosModel = {
    // Buscar si el token de la cookie ya existe y sigue activo
    buscarSesionPorToken: async (token) => {
        const query = `
            SELECT id, apodo FROM sesion 
            WHERE token = ? AND ultimo_activo >= NOW() - INTERVAL 24 HOUR 
            LIMIT 1
        `;
        const [rows] = await pool.execute(query, [token]);
        return rows[0];
    },

    // Registrar la nueva sesión anónima autogenerada
    crearSesionAnonima: async ({ id, token, apodo }) => {
        const query = `
            INSERT INTO sesion (id, token, apodo) 
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(query, [id, token, apodo]);
        return result;
    },

    // El método que ya tenías para crear mensajes
    crearMensaje: async ({ id, sesion_id, contenido, expira_en, horas_visibilidad }) => {
        const query = `
            INSERT INTO mensaje (id, sesion_id, contenido, expira_en, horas_visibilidad)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [id, sesion_id, contenido, expira_en, horas_visibilidad]);
        return result;
    }
};