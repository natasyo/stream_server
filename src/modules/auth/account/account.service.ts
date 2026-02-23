import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { hash } from 'argon2';

@Injectable()
export class AccountService {
	public constructor(private readonly prismaService: PrismaService) {}
	public async findAll() {
		return this.prismaService.user.findMany();
	}
	public async getcurrentUser(id: string) {
		return this.prismaService.user.findUnique({
			where: {
				id
			}
		});
	}
	public async create({ email, password, userName }: CreateUserInput) {
		const isExistEmail = await this.prismaService.user.findUnique({
			where: { email }
		});
		if (isExistEmail) {
			throw new ConflictException('Email already exists');
		}
		const isExistUserName = await this.prismaService.user.findUnique({
			where: { userName }
		});
		if (isExistUserName) {
			throw new ConflictException('Username already exists');
		}
		await this.prismaService.user.create({
			data: {
				email,
				password: await hash(password),
				userName,
				displayName: userName
			}
		});
		return true;
	}
}
