import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../account/models/user.model';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { type SessionData } from 'express-session';

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly config: ConfigService,
		private readonly redisService: RedisService
	) {}

	async findByUser(req: Request) {
		const userId = req.session.userId;
		if (!userId) throw new NotFoundException('User not found');

		const sessionName: string = this.config.getOrThrow('SESSION_FOLDER');
		// const sessionIds = await this.redisService.client.get(`${sessionName}`);
		const keys = await this.redisService.client.keys(`${sessionName}*`);

		for (const key of keys) {
			const session = await this.redisService.client.get(key);
			console.log(session);
		}
		const userSessions: Array<SessionData & { id: string }> = [];
		// for (const id of sessionIds) {
		// 	const sessionData = await this.redisService.client.get(
		// 		`${sessionName}:${id}`
		// 	);
		// 	if (!sessionData) continue;
		// 	const session = JSON.parse(sessionData) as SessionData;
		// 	if (id !== req.sessionID) {
		// 		userSessions.push({
		// 			...session,
		// 			id
		// 		});
		// 	}
		// }
		return userSessions;
	}

	async findCurrent(req: Request): Promise<SessionData & { id: string }> {
		const sessionId = req.session.id;
		if (!sessionId) throw new NotFoundException('User not found');
		const sessionData = await this.redisService.client.get(
			`${this.config.getOrThrow('SESSION_FOLDER')}${sessionId}`
		);
		console.log(`${this.config.getOrThrow('SESSION_FOLDER')}${sessionId}`);
		if (!sessionData) throw new NotFoundException('User not found');
		const session = JSON.parse(sessionData) as SessionData;
		return {
			...session,
			createdAt: new Date(session.createdAt),
			id: sessionId
		};
	}

	async login(
		req: Request,
		{ login, password }: LoginInput,
		userAgent: string
	) {
		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ userName: { equals: login } },
					{ email: { equals: login } }
				]
			}
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		const isValidPassword = await verify(user.password, password);
		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid credentials');
		}
		const sessionMetadata = getSessionMetadata(req, userAgent);
		await new Promise<void>((resolve, reject) => {
			req.session.userId = user.id;
			req.session.createdAt = new Date();
			req.session.metadata = sessionMetadata;
			req.session.save(err => {
				if (err) {
					console.error('Failed to save session:', err);
					return reject(
						new InternalServerErrorException(
							'Failed to save session'
						)
					);
				}
				resolve();
			});
		});
		await this.redisService.client.sadd(
			`user:${this.config.getOrThrow('SESSION_FOLDER')}${user.id}`,
			req.session.id
		);
		const ttl = await this.redisService.client.ttl(
			`${this.config.getOrThrow('SESSION_FOLDER')}${req.session.id}`
		);
		if (ttl > 0) {
			await this.redisService.client.expire(
				`user:${this.config.getOrThrow('SESSION_FOLDER')}${user.id}`,
				ttl
			);
		}
		return user as UserModel;
	}
	async logout(req: Request) {
		const userId = req.session.userId;
		const sessionId = req.session.id;
		if (userId) {
			await this.redisService.client.srem(
				`user:${this.config.getOrThrow('SESSION_FOLDER')}${userId}`,
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
				req.res?.clearCookie(this.config.getOrThrow('SESSION_NAME'));

				resolve(true);
			});
		});
	}

	clearSession(req: Request) {
		req.res?.clearCookie(this.config.getOrThrow('SESSION_NAME'));
		return true;
	}
	async remove(req: Request, id: string) {
		if (req.session.id === id)
			throw new ConflictException('Current session does not remove');
		await this.redisService.client.del(
			`${this.config.getOrThrow('SESSION_FOLDER')}:${id}`
		);

		return true;
	}
}
