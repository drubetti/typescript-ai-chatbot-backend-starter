import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDoc } from '../jsdoc';

const router = Router();

router.use('/', swaggerUi.serveFiles(swaggerDoc), swaggerUi.setup(swaggerDoc));

export default router;
