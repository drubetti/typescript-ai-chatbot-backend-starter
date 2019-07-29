import { serverPort } from '@utils/env'; // This must be loaded before anything else.

import process from 'node:process';
import app from '@app';
import { closeDb, initDb } from '@chat/db';
import { closeVectorDb, initVectorDb } from '@chat/vectorDb';
import { name } from '@package';
import initCron from '@utils/cron';
import logger from '@utils/logger';
import onDeath from 'death';

const port = Number.parseInt(serverPort);

const registerExitCallback = onDeath({ uncaughtException: true });

const onError = (err: unknown) => {
	logger.error(err);
	process.exit(1);
};

const unRegisterExitCallback = registerExitCallback(async () => {
	logger.info('Stopping server...');
	try {
		unRegisterExitCallback();
		await Promise.all([closeDb(true), closeVectorDb()]);
		process.exit(0);
	} catch (err) {
		onError(err);
	}
});

const startServer = async () => {
	logger.info('Starting server...');
	try {
		logger.info('Initialising DB(s)...');
		await Promise.all([initDb(), initVectorDb()]);
		logger.info('Initialising cron(s)...');
		initCron();
		app.listen(port, () => logger.info(`${name} is running on port ${port}!`));
	} catch (err) {
		onError(err);
	}
};

void startServer();
