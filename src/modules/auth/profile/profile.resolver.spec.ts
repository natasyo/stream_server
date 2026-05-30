import { Test, TestingModule } from '@nestjs/testing';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';

describe('ProfileResolver', () => {
	let resolver: ProfileResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProfileResolver,
				ProfileService,
				{ provide: StorageService, useValue: {} },
				{ provide: PrismaService, useValue: {} }
			]
		}).compile();

		resolver = module.get<ProfileResolver>(ProfileResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
