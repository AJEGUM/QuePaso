import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js';

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// 1. Configuración de CORS
app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. Middlewares para parsear el cuerpo de las peticiones
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 3. Enrutamiento del sistema (Definición de endpoints semánticos)
app.use('/api/usuarios', usuariosRoutes);

export { app };