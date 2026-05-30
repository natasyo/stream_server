import { Test, TestingModule } from '@nestjs/testing';
import { DeactivateResolver } from './deactivate.resolver';
import { DeactivateService } from './deactivate.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { RedisService } from '@/src/core/redis/redis.service';
import { ConfigService } from '@nestjs/config/dist/config.service';

describe('DeactivateResolver', () => {
	let resolver: DeactivateResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeactivateResolver,
				DeactivateService,
				{
					provide: PrismaService,
					useValue: {}
				},
				{
					provide: ConfigService,
					useValue: {}
				},
				{
					provide: MailService,
					useValue: {}
				},
				{
					provide: RedisService,
					useValue: {}
				}
			]
		}).compile();

		resolver = module.get<DeactivateResolver>(DeactivateResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
