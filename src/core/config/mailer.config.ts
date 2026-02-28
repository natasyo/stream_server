import { ConfigService } from '@nestjs/config/dist/config.service';
import type { MailerOptions } from '@nestjs-modules/mailer';

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<string>('MAIL_PORT'),
			secure: false,
			auth: {
				login: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASS')
			}
		},
		defaults: {
			from: `"Stream" ${configService.getOrThrow<string>('MAIL_LOGIN')}`
		}
	};
}
