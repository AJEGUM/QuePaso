import { usuariosService } from '../services/usuariosService.js';

export const verificarOSesion = async (req, res, next) => {
    try {
        // Buscamos la cookie llamada 'qp_session'
        const tokenCookie = req.cookies ? req.cookies['qp_session'] : null;

        // El servicio nos retorna la sesión vieja o crea una nueva al vuelo
        const sesion = await usuariosService.obtenerOCrearSesion(tokenCookie);

        // Si se creó una nueva sesión, le actualizamos la cookie de forma segura al cliente
        if (sesion.esNueva) {
            res.cookie('qp_session', sesion.token, {
                httpOnly: true, // Seguridad contra ataques XSS
                secure: process.env.NODE_ENV === 'production', // true solo en producción con HTTPS
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 Horas de vida en el navegador
            });
        }

        // Inyectamos los datos de la sesión anónima en la petición para usarlos en el controlador
        req.sesion_id = sesion.id;
        req.apodo = sesion.apodo;

        next();
    } catch (error) {
        console.error('Error en el middleware de sesión anónima:', error);
        return res.status(500).json({ error: 'Error al establecer sesión anónima' });
    }
};