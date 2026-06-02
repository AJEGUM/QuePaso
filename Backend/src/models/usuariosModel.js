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
    },

    obtenerMensajesMuro: async () => {
        const query = `
            SELECT 
                m.id,
                m.contenido,
                m.creado_en,
                m.expira_en,
                s.apodo AS autor_apodo
            FROM mensaje m
            INNER JOIN sesion s ON m.sesion_id = s.id
            WHERE m.activo = 1 
              AND m.expira_en > NOW()
            ORDER BY m.creado_en DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    },

    verificarReporteExistente: async (mensajeId, ipHash) => {
        const query = `
            SELECT id FROM reporte 
            WHERE mensaje_id = ? AND ip_hash_reportante = ?
        `;
        const [rows] = await pool.execute(query, [mensajeId, ipHash]);
        return rows.length > 0;
    },

    // Registrar la denuncia en la base de datos
    crearReporte: async (mensajeId, ipHash, motivo) => {
        const query = `
            INSERT INTO reporte (mensaje_id, ip_hash_reportante, motivo)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(query, [mensajeId, ipHash, motivo]);
        return result;
    }
};