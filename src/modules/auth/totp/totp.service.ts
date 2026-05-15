import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '@prisma/client';
import { Secret, TOTP } from 'otpauth';
import { qrToDataURL } from 'qr-generate-ts';
import { EnableTotpInput } from '@/src/modules/auth/totp/inputs/enable-totp.input';
import { PrismaService } from '@/src/core/prisma/prisma.service';

@Injectable()
export class TotpService {
	public constructor(private readonly prismaService: PrismaService) {}
	public async generate(user: User) {
		const secret = new Secret({ size: 20 }).base32;
		const totp = new TOTP({
			issuer: 'Stream',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		});
		const optAuthUrl = totp.toString();
		const qrCodeUrl = await qrToDataURL(optAuthUrl);
		return { qrCodeUrl, secret };
	}

	public async enable(user: User, input: EnableTotpInput) {
		const { secret, pin } = input;
		const totp = new TOTP({
			issuer: 'Stream',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		});
		const delta = totp.validate({ token: pin, window: 1 });
		if (delta === null) {
			throw new BadRequestException('Invalid TOTP token');
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { totpSecret: secret, isTotpEnabled: true }
		});
		return true;
	}
	public async disable(user: User) {
		await this.prismaService.user.update({
			where: { id: user.id },
			data: { totpSecret: null, isTotpEnabled: false }
		});
		return true;
	}
}
