import { routes as chatRoutes } from '@chat/index';
import { routes as documentsRoutes } from '@documents/index';
import { routes as swaggerRoutes } from '@swagger/index';
import { errorsHandler, loggerMiddleware } from '@utils/index';
import { routes as versionRoutes } from '@version/index';
import bodyParser from 'body-parser';
import { errors as celebrateErrors } from 'celebrate';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors());
app.use(loggerMiddleware);
app.use(compression());
app.use(bodyParser.json());
app.use('/', versionRoutes);
app.use('/chat', chatRoutes);
app.use('/documents', documentsRoutes);
app.use('/public', express.static('public'));
app.use('/swagger', swaggerRoutes);
app.use(celebrateErrors());
app.use(errorsHandler);

export default app;
