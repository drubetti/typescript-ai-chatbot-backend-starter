import { celebrate as validateRequest } from 'celebrate';
import { Router } from 'express';
import sendVersion from '../middlewares/sendVersion';
import versionRequestSchema from '../schemas/versionRequestSchema';

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     security: []
 *     tags:
 *       - Heartbeat
 *     description: Heartbeat endpoint
 *     responses:
 *       200:
 *         description: Returns the app's version.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: '0.0.1'
 */
router.get('/', validateRequest(versionRequestSchema), sendVersion);

export default router;
