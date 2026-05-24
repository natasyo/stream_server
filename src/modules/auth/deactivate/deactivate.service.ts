import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TokenType, User } from '@prisma/client';
import { destroySession } from '@/src/shared/utils/session.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { Request } from 'express';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { DeactivateAccountInput } from '@/src/modules/auth/deactivate/inputs/deactivate-account.input';
import { verify } from 'argon2';

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly mailerService: MailService,
		private readonly redisService: RedisService
	) {}

	private async validateDeactivateToken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		});
		if (!existingToken) {
			throw new NotFoundException('No token found.');
		}
		const hasExpired = new Date(existingToken.expiresIn) > new Date();
		if (!hasExpired) throw new BadRequestException('Token expired.');
		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date()
			}
		});
		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		});
		return destroySession(req, this.redisService, this.configService);
	}

	public async deactivateAccount(
		req: Request,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string
	) {
		const { email, pin, password } = input;
		if (user.email !== email)
			throw new BadRequestException('Invalid email');
		const isValidPassword = await verify(user.password, password);
		if (!isValidPassword) throw new BadRequestException('Invalid password');
		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent);
			return { message: 'Требуется код подтверждения' };
		}

		await this.validateDeactivateToken(req, pin);
		return { user };
	}

	public async sendDeactivateToken(
		req: Request,
		user: User,
		userAgent: string
	) {
		const deactivateToken = await generateToken(
			TokenType.DEACTIVATE_ACCOUNT,
			user,
			this.prismaService,
			false
		);
		const metadata = getSessionMetadata(req, userAgent);
		await this.mailerService.sendDeactivateToken(
			user.email,
			deactivateToken.token,
			metadata
		);
		return true;
	}
}
