import { Test, TestingModule } from '@nestjs/testing';
import { DeactivateService } from './deactivate.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { RedisService } from '@/src/core/redis/redis.service';

describe('DeactivateService', () => {
	let service: DeactivateService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
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

		service = module.get<DeactivateService>(DeactivateService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
