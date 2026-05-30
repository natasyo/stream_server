import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';

describe('ProfileService', () => {
	let service: ProfileService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProfileService,
				{
					provide: PrismaService,
					useValue: {}
				},
				{
					provide: StorageService,
					useValue: {}
				}
			]
		}).compile();

		service = module.get<ProfileService>(ProfileService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
