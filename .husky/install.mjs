// Skip Husky install in production and CI
import process from 'node:process';

const { CI, NODE_ENV } = process.env;
const isCI = CI === 'true';
const isProduction = NODE_ENV === 'production';
const shouldInstallHusky = !isCI && !isProduction;

if (shouldInstallHusky) {
	console.log('Installing Husky...');
	const { default: installHusky } = await import('husky');
	console.log(installHusky());
} else {
	console.log('Skipping Husky installation.');
}
