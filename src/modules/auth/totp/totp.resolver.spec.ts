import { Test, TestingModule } from '@nestjs/testing';
import { TotpResolver } from './totp.resolver';
import { TotpService } from './totp.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';

describe('TotpResolver', () => {
	let resolver: TotpResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TotpResolver,
				TotpService,
				{
					provide: PrismaService,
					useValue: {}
				}
			]
		}).compile();

		resolver = module.get<TotpResolver>(TotpResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
