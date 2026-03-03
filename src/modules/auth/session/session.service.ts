import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { type SessionData } from 'express-session';
import { destroySession, saveSession } from '@/src/shared/utils/session.util';
import { VerificationService } from '@/src/modules/auth/verification/verification.service';

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly config: ConfigService,
		private readonly redisService: RedisService,
		private readonly verificationService: VerificationService
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
		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user);
			throw new BadRequestException(
				'Email not verified. Go to your email to verify'
			);
		}
		const sessionMetadata = getSessionMetadata(req, userAgent);

		return await saveSession(
			req,
			user,
			this.redisService,
			this.config,
			sessionMetadata
		);
	}
	async logout(req: Request) {
		return destroySession(req, this.redisService, this.config);
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
