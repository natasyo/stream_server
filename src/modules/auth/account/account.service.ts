import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { hash, verify } from 'argon2';
import { VerificationService } from '@/src/modules/auth/verification/verification.service';
import { ChangeEmailInput } from '@/src/modules/auth/account/inputs/change-email.input';
import { User } from '@prisma/client';
import { ChangePasswordInput } from '@/src/modules/auth/account/inputs/change-password.input';

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService
	) {}
	public async findAll() {
		return this.prismaService.user.findMany();
	}
	public async getCurrentUser(id: string) {
		return this.prismaService.user.findUnique({
			where: {
				id
			}
		});
	}
	public async create({ email, password, userName }: CreateUserInput) {
		const isExistEmail = await this.prismaService.user.findUnique({
			where: { email },
		});
		if (isExistEmail) {
			throw new ConflictException('Email already exists');
		}
		const isExistUserName = await this.prismaService.user.findUnique({
			where: { userName },
			include: { socialLinks: true }
		});
		if (isExistUserName) {
			throw new ConflictException('Username already exists');
		}
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: await hash(password),
				userName,
				displayName: userName,
				stream: {
					create: {
						title: `Stream ${userName}`
					}
				}
			}
		});
		await this.verificationService.sendVerificationToken(user);
		return true;
	}
	public async changeEmail(user: User, input: ChangeEmailInput) {
		const { email } = input;
		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email
			}
		});
		return true;
	}

	async changePassword(user: User, input: ChangePasswordInput) {
		const { oldPassword, newPassword } = input;
		const isValidPassword = await verify(user.password, oldPassword);
		if (!isValidPassword) {
			throw new UnauthorizedException('Неверный старый пароль');
		}

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				password: await hash(newPassword)
			}
		});
		return true;
	}
}
