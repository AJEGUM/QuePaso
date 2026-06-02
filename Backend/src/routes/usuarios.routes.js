import { Router } from 'express';
import { adminController } from '../controllers/usuarios.controller.js';
import { verificarOSesion } from '../middlewares/auth.middleware.js'; // Importar el middleware

const router = Router();

// Endpoint semántico protegido por el validador de sesión transparente
router.post('/mensaje', verificarOSesion, adminController.publicarMensaje);
router.get('/muro', verificarOSesion, adminController.obtenerMuro);
router.post('/reportar', verificarOSesion, adminController.denunciarMensaje);

export default router;