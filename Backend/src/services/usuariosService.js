import { usuariosModel } from '../models/usuariosModel.js';
import crypto from 'crypto';

export const usuariosService = {
    // Orquesta la verificación o creación transparente de la sesión
    obtenerOCrearSesion: async (tokenExistente) => {
        if (tokenExistente) {
            const sesion = await usuariosModel.buscarSesionPorToken(tokenExistente);
            if (sesion) return { id: sesion.id, token: tokenExistente, apodo: sesion.apodo, esNueva: false };
        }

        // Si no existe o expiró, generamos una sesión completamente nueva y anónima
        const id = crypto.randomUUID();
        const token = crypto.randomBytes(32).toString('hex'); // Genera un token seguro de 64 caracteres
        
        // Generador simple de apodos anónimos
        const animales = ['Pato', 'Nube', 'Zorro', 'Gato', 'Lobo', 'Jaguar', 'Astronauta'];
        const numeroAleatorio = Math.floor(Math.random() * 100);
        const apodo = `${animales[Math.floor(Math.random() * animales.length)]}${numeroAleatorio}`;

        await usuariosModel.crearSesionAnonima({ id, token, apodo });

        return { id, token, apodo, esNueva: true };
    },

    subirMensaje: async ({ sesion_id, contenido, horas_visibilidad }) => {
        const id = crypto.randomUUID();
        const horas = horas_visibilidad || 1;

        const fecha_actual = new Date();
        fecha_actual.setHours(fecha_actual.getHours() + horas);
        const expira_en = fecha_actual.toISOString().slice(0, 19).replace('T', ' ');

        await usuariosModel.crearMensaje({
            id,
            sesion_id,
            contenido,
            expira_en,
            horas_visibilidad: horas
        });

        return { id, estado: 'Mensaje publicado exitosamente', expira_en };
    },

    listarMensajesMuro: async () => {
        const mensajes = await usuariosModel.obtenerMensajesMuro();
        
        // Retornamos los mensajes orquestados
        return mensajes.map(msg => ({
            id: msg.id,
            contenido: msg.contenido,
            creado_en: msg.creado_en,
            expira_en: msg.expira_en,
            autor: msg.autor_apodo
        }));
    }
};