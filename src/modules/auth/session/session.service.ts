import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../account/models/user.model';

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly config: ConfigService
	) {}
	async login(req: Request, { login, password }: LoginInput) {
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
		return new Promise<UserModel>((resolve, reject) => {
			req.session.userId = user.id;
			req.session.createdAt = new Date();

			req.session.save(err => {
				if (err) {
					console.error('Failed to save session:', err);
					return reject(
						new InternalServerErrorException(
							'Failed to save session'
						)
					);
				}
				resolve(user as UserModel);
			});
		});
	}
	async logout(req: Request) {
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
}
