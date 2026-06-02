import { usuariosService } from '../services/usuariosService.js';

export const adminController = {
    publicarMensaje: async (req, res) => {
        try {
            const { contenido, horas_visibilidad } = req.body;
            
            // Extraído directamente desde el middleware de forma transparente
            const sesion_id = req.sesion_id; 

            // Validación del contenido (el check de tu DB no permite vacíos ni puros espacios)
            if (!contenido || !contenido.trim()) {
                return res.status(400).json({ 
                    error: 'El contenido del mensaje no puede estar vacío.' 
                });
            }

            const resultado = await usuariosService.subirMensaje({ 
                sesion_id, 
                contenido, 
                horas_visibilidad 
            });

            // Agregamos el apodo anónimo asignado al cliente en el response por si deseas mostrarlo en el frontend
            return res.status(201).json({
                ...resultado,
                autorAnonimo: req.apodo
            });
        } catch (error) {
            console.error('Error en adminController.publicarMensaje:', error);
            return res.status(500).json({ 
                error: 'Error interno del servidor al procesar el mensaje' 
            });
        }
    },

    obtenerMuro: async (req, res) => {
        try {
            const mensajes = await usuariosService.listarMensajesMuro();
            
            // Retorno semántico con código HTTP 200 OK
            return res.status(200).json({
                total: mensajes.length,
                mensajes
            });
        } catch (error) {
            console.error('Error en adminController.obtenerMuro:', error);
            return res.status(500).json({ 
                error: 'Error interno del servidor al recuperar el muro de mensajes.' 
            });
        }
    },

    denunciarMensaje: async (req, res) => {
        try {
            const { mensaje_id, motivo } = req.body;

            // Validación de parámetros obligatorios
            if (!mensaje_id || !motivo) {
                return res.status(400).json({ 
                    error: 'Los campos mensaje_id y motivo son estrictamente obligatorios.' 
                });
            }

            // Validar que el motivo coincida exactamente con el ENUM de la base de datos
            const motivosValidos = ['spam', 'contenido_explicito', 'violencia', 'ilegal', 'otro'];
            if (!motivosValidos.includes(motivo)) {
                return res.status(400).json({ 
                    error: 'El motivo proporcionado no es válido.' 
                });
            }

            // Extraer la IP real teniendo en cuenta Cloudflare o proxys como Nginx
            const ipOriginal = req.headers['cf-connecting-ip'] || 
                               req.headers['x-forwarded-for'] || 
                               req.socket.remoteAddress || 
                               '127.0.0.1';

            // Orquestar a través del servicio
            const resultado = await usuariosService.registrarDenuncia(mensaje_id, ipOriginal, motivo);

            return res.status(201).json({
                mensaje: 'Reporte registrado para revisión con éxito.',
                data: resultado
            });

        } catch (error) {
            console.error('Error en reporteController.denunciarMensaje:', error.message);
            
            // Si el servicio arrojó un error controlado por duplicado
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }

            return res.status(500).json({ 
                error: 'Error interno del servidor al procesar la denuncia.' 
            });
        }
    }
};