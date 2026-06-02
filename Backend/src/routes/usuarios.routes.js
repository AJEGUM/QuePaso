import { Router } from 'express';
import { adminController } from '../controllers/usuarios.controller.js';

const router = Router();

// Endpoint semántico POST utilizando el método del objeto mapeado
router.post('/mensaje', adminController.publicarMensaje);

export default router;