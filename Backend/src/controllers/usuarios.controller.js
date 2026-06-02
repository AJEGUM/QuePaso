import { adminService } from '../services/usuariosService.js';

export const adminController = {
    publicarMensaje: async (req, res) => {
        try {
            const { sesion_id, contenido, horas_visibilidad } = req.body;

            // Validación básica del parámetro obligatorio
            if (!sesion_id) {
                return res.status(400).json({ 
                    error: 'El parámetro sesion_id es obligatorio' 
                });
            }

            // Ejecutar la lógica de negocio desde el objeto del servicio
            const resultado = await adminService.subirMensaje({ sesion_id, contenido, horas_visibilidad });

            return res.status(201).json(resultado);
        } catch (error) {
            console.error('Error en adminController.publicarMensaje:', error);
            return res.status(500).json({ 
                error: 'Error interno del servidor al procesar el mensaje' 
            });
        }
    }
};