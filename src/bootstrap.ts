import { serverPort } from '@utils/env'; // This must be loaded before anything else.

import process, { exit } from 'node:process';
import app from '@app';
import { closeDb, initDb } from '@chat/db';
import { closeVectorDb, initVectorDb } from '@chat/vectorDb';
import { name } from '@package';
import initCron from '@utils/cron';
import logger from '@utils/logger';
import onDeath from 'death';

const EXIT_TIMEOUT = 1_000; // Wait for loggers to flush before exiting.
const port = Number.parseInt(serverPort);
const registerExitCallback = onDeath({ uncaughtException: true });

const onAppError = (err: unknown) => {
	logger.error(err);
	process.exitCode = 1;
	setTimeout(() => exit(), EXIT_TIMEOUT);
};

const onSignalOrUncaughtException = async (
	signalOrError: string | Error,
	origin: string | Error,
) => {
	unRegisterExitCallback();

	if (typeof signalOrError === 'string') {
		logger.info(`Received signal: ${signalOrError}`);

		if (origin instanceof Error) {
			logger.error(origin);
			process.exitCode = 1;
		}
	} else if (signalOrError) {
		logger.error(signalOrError);
		process.exitCode = 1;
	}

	logger.info('Stopping server...');

	try {
		await Promise.all([closeDb(true), closeVectorDb()]);
		exit();
	} catch (err) {
		onAppError(err);
	}
};

const unRegisterExitCallback = registerExitCallback(
	// @ts-ignore: "origin" type definition is wrong!
	onSignalOrUncaughtException,
);

const onAppListen = (error?: Error) => {
	if (error) throw error;
	logger.info(`${name} is running on port ${port}!`);
};

const startServer = async () => {
	logger.info('Starting server...');
	try {
		logger.info('Initialising DB(s)...');
		await Promise.all([initDb(), initVectorDb()]);
		logger.info('Initialising cron(s)...');
		initCron();
		app.listen(port, onAppListen);
	} catch (err) {
		onAppError(err);
	}
};

void startServer();
