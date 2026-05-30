import { Test, TestingModule } from '@nestjs/testing';
import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';

describe('StreamResolver', () => {
	let resolver: StreamResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StreamResolver,
				StreamService,
				{
					provide: PrismaService,
					useValue: {}
				}
			]
		}).compile();

		resolver = module.get<StreamResolver>(StreamResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
