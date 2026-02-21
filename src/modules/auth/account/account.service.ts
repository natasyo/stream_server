import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
	public constructor(private readonly prismaService: PrismaService) {}
	public async findAll() {
		return this.prismaService.user.findMany();
	}
}
