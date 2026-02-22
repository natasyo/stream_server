import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		super({
			adapter: new PrismaPg({
				connectionString: process.env.DATABASE_URL
			})
		});
	}
	public async onModuleDestroy() {
		await this.$disconnect();
	}
	public async onModuleInit() {
		await this.$connect();
	}
}
