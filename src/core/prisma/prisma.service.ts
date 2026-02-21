import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreatePrismaDto } from './dto/create-prisma.dto';
import { UpdatePrismaDto } from './dto/update-prisma.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		const connectionString = `${process.env.DATABASE_URL}`;
		const adapter = new PrismaPostgresAdapter({ connectionString });
		super({ adapter });
	}
	public;
	async onModuleDestroy() {
		await this.$disconnect();
	}
	public async onModuleInit() {
		await this.$connect();
	}
}
