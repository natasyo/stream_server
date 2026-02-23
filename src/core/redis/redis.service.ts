import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
	public readonly client: Redis;
	public constructor(private readonly configService: ConfigService) {
		this.client = new Redis(configService.getOrThrow<string>('REDIS_URL'));
	}
}
