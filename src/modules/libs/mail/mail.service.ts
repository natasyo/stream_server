import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { render } from '@react-email/components';
import { VerificationTemplate } from '@/src/modules/libs/mail/templates/verification.template';
import { SentMessageInfo } from 'nodemailer';
import { ResetPasswordTemplate } from '@/src/modules/libs/mail/templates/reset-password.template';
import { ISessionMetadata } from '@/src/shared/types/session-metadata.types';
import * as domain from 'node:domain';
import DeactivateTemplate from '@/src/modules/libs/mail/templates/deactivate.template';

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	private sendEmail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		});
	}
	async sendVerificationEmail(email: string, token: string): SentMessageInfo {
		const domain = this.configService.getOrThrow<string>('ALLOW_ORIGIN');
		const html = await render(VerificationTemplate({ token, domain }));
		return this.sendEmail(email, 'Verify your email', html);
	}

	async sendResetPasswordEmail(
		email: string,
		token: string,
		userAgent: string
	): SentMessageInfo {
		const domain = this.configService.getOrThrow<string>('ALLOW_ORIGIN');
		const html = await render(
			ResetPasswordTemplate({ token, domain, userAgent })
		);
		return this.sendEmail(email, 'Reset password', html);
	}
	async sendDeactivateToken(
		email: string,
		token: string,
		metadata: ISessionMetadata
	): SentMessageInfo {
		const html = await render(DeactivateTemplate({ token, metadata }));
		return this.sendEmail(email, 'Деактивация аккаунта', html);
	}
}
