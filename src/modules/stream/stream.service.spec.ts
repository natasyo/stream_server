import { Test, TestingModule } from '@nestjs/testing';
import { StreamService } from './stream.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';

describe('StreamService', () => {
	let service: StreamService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StreamService,
				{
					provide: PrismaService,
					useValue: {}
				},
				{
					provide:StreamService,
					useValue:{}
				}
			]
		}).compile();

		service = module.get<StreamService>(StreamService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
