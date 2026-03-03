import { Request } from 'express';
import { User } from '@prisma/client';
import { ISessionMetadata } from '@/src/shared/types/session-metadata.types';
import { RedisService } from '@/src/core/redis/redis.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { InternalServerErrorException } from '@nestjs/common';

export async function saveSession(
	req: Request,
	user: User,
	redisService: RedisService,
	config: ConfigService,
	sessionMetadata: ISessionMetadata
) {
	await new Promise<void>((resolve, reject) => {
		req.session.userId = user.id;
		req.session.createdAt = new Date();
		req.session.metadata = sessionMetadata;
		req.session.save(err => {
			if (err) {
				console.error('Failed to save session:', err);
				return reject(
					new InternalServerErrorException('Failed to save session')
				);
			}
			resolve();
		});
	});
	await redisService.client.sadd(
		`user:${config.getOrThrow('SESSION_FOLDER')}${user.id}`,
		req.session.id
	);
	const ttl = await redisService.client.ttl(
		`${config.getOrThrow('SESSION_FOLDER')}${req.session.id}`
	);
	if (ttl > 0) {
		await redisService.client.expire(
			`user:${config.getOrThrow('SESSION_FOLDER')}${user.id}`,
			ttl
		);
	}
	return user as UserModel;
}

export async function destroySession(
	req: Request,
	redisService: RedisService,
	config: ConfigService
) {
	const userId = req.session.userId;
	const sessionId = req.session.id;
	if (userId) {
		await redisService.client.srem(
			`user:${config.getOrThrow('SESSION_FOLDER')}${userId}`,
			sessionId
		);
	}
	return new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				return reject(
					new InternalServerErrorException(
						'Failed to destroy session'
					)
				);
			}
			req.res?.clearCookie(config.getOrThrow('SESSION_NAME'));

			resolve(true);
		});
	});
}
