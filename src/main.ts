import { CoreModule } from './core/core.module';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

async function bootstrap() {
	const myEnv = dotenv.config();
	dotenvExpand.expand(myEnv);
	const app = await NestFactory.create(CoreModule);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
