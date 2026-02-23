import { CoreModule } from './core/core.module';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { parseBoolean } from './shared/utils/parse-boolean.util';
import { RedisService } from './core/redis/redis.service';

async function bootstrap() {
	const myEnv = dotenv.config();
	dotenvExpand.expand(myEnv);
	const app = await NestFactory.create(CoreModule);
	const config = app.get(ConfigService);
	const redis = app.get(RedisService);
	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOW_ORIGIN'),
		credentials: true,
		exposedHeaders: ['Set-Cookie']
	});
	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				maxAge: 1000 * 60 * 60 * 24,
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: {
					get: (key: string) => redis.client.get(key),
					set: (key: string, val: string, options?: any) => {
						const ttl = 24 * 60 * 60;
						if (ttl) {
							return redis.client.set(key, val, 'EX', ttl);
						}
						return redis.client.set(key, val);
					},
					del: (key: string) => redis.client.del(key).then(() => {})
				},
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
				disableTouch: true
			})
		})
	);
	await app.listen(config.getOrThrow<number>('APPLICATION_PORT') ?? 3000);
	console.log(process.env.DATABASE_URL);
}
bootstrap();
