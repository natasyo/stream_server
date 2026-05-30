import { Test, TestingModule } from '@nestjs/testing';
import { CronService } from './cron.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';

describe('CronService', () => {
	let service: CronService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CronService,
				{
					provide: PrismaService,
					useValue: {}
				},
				{
					provide: MailService,
					useValue: {}
				},
				{
					provide: StorageService,
					useValue: {}
				}
			]
		}).compile();

		service = module.get<CronService>(CronService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
