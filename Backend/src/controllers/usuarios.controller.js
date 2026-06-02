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
    }
};