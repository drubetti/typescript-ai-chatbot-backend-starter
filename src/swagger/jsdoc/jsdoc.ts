import swaggerJsdoc from 'swagger-jsdoc';
import { jsDocDonfig } from './config';

const swaggerDoc = swaggerJsdoc(jsDocDonfig);

export { swaggerDoc };
