import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validator.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../validators/schemas';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role, firstName, lastName]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               role: { type: string, enum: [ADMIN, TEACHER, STUDENT, PARENT] }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               subject: { type: string }
 *               dateOfBirth: { type: string, format: date }
 *               phoneNumber: { type: string }
 *     responses:
 *       201: { description: User registered successfully }
 *       409: { description: Email already registered }
 *       422: { description: Validation error }
 */
router.post('/register', validateRequest(registerSchema), controller.register.bind(controller));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validateRequest(loginSchema), controller.login.bind(controller));

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile retrieved }
 *       401: { description: Unauthorized }
 */
router.get('/profile', authMiddleware, controller.getProfile.bind(controller));

export default router;
