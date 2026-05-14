import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { VerificationInput } from '@/src/modules/auth/verification/inputs/verification.input';
import { Request } from 'express';
import { TokenType, User } from '@prisma/client';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { saveSession } from '@/src/shared/utils/session.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { generateToken } from '@/src/shared/utils/generate-token.util';
@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService
	) {}
	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: input.token,
				type: TokenType.EMAIL_VERIFY
			}
		});
		if (!existingToken) throw new NotFoundException('Token not found');

		const hasExpired = new Date(existingToken.expiresIn) > new Date();
		console.log(new Date(existingToken.expiresIn), new Date());
		if (!hasExpired) throw new BadRequestException('Token has expired');

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		});
		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		});

		const metadata = getSessionMetadata(req, userAgent);
		return saveSession(
			req,
			user,
			this.redisService,
			this.configService,
			metadata
		);
	}
	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			TokenType.EMAIL_VERIFY,
			user,
			this.prismaService,
			true
		);
		await this.mailService.sendVerificationEmail(
			user.email,
			verificationToken.token
		);
		return true;
	}
}
