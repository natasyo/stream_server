import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ResetPasswordInput } from '@/src/modules/auth/reset-password/inputs/reset-password.input';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { TokenType } from '@prisma/client';
import { hash } from 'argon2';
import { NewPasswordInput } from '@/src/modules/auth/reset-password/inputs/new-password.input';

@Injectable()
export class ResetPasswordService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService
	) {}
	async resetPassword({ email }: ResetPasswordInput, userAgent: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			}
		});
		if (!user) throw new NotFoundException('User not found');
		const resetToken = await generateToken(
			TokenType.RESET_PASSWORD,
			user,
			this.prismaService,
			true
		);

		await this.mailService.sendResetPasswordEmail(
			email,
			resetToken.token,
			userAgent
		);
		return true;
	}
	async newPassword({ token, password }: NewPasswordInput) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.RESET_PASSWORD
			}
		});
		if (!existingToken) throw new NotFoundException('Token not found');

		if (new Date(existingToken.expiresIn) < new Date()) {
			await this.prismaService.token.delete({
				where: {
					token: existingToken.token,
					type: TokenType.RESET_PASSWORD
				}
			});
			throw new ForbiddenException('Token expired');
		}

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				password: await hash(password)
			}
		});
		await this.prismaService.token.delete({
			where: {
				token: existingToken.token,
				type: TokenType.RESET_PASSWORD
			}
		});
		return true;
	}
}
