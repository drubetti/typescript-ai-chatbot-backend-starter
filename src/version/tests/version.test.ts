import app from '@app';
import { version } from '@package';
import request from 'supertest';

describe('Version API', () => {
	test('Should return version', async () => {
		const { status, text } = await request(app).get('/');
		expect(status).toBe(200);
		expect(text).toBe(version);
	});
});
