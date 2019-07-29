import { removeStaleLocks } from '@chat/db';
import { logger } from '@utils/index';
import { CronJob, CronTime } from 'cron';

const CRON_TIMEZONE = 'Europe/Rome';
const CRON_TIME = '0 * * * * *';
const cronTime = new CronTime(CRON_TIME).toString();

export const initCron = () => {
	const removeStaleLocksJob = async () => {
		try {
			const deletedCount = await removeStaleLocks();
			deletedCount &&
				logger.info(`Cron job removed ${deletedCount} stale locks.`);
		} catch (error) {
			logger.error(error);
		}
	};
	new CronJob(cronTime, removeStaleLocksJob, null, true, CRON_TIMEZONE);
	logger.info(`CronJob scheduled at "${cronTime}", ${CRON_TIMEZONE}.`);
};

export default initCron;
