import { AccountService } from '@/src/modules/auth/account/account.service';
import { Test, TestingModule } from '@nestjs/testing';
import { hash, verify } from 'argon2';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { VerificationService } from '@/src/modules/auth/verification/verification.service';

jest.mock('argon2', () => ({
	hash: jest.fn(),
	verify: jest.fn()
}));

describe('Account Service', () => {
	let service: AccountService;
	let prisma: PrismaService;
	let verificationService: VerificationService;

	const mockPrismaService = {
		user: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			create: jest.fn(),
			update: jest.fn()
		}
	};

	const mockVerificationService = {
		sendVerificationToken: jest.fn().mockResolvedValue(true)
	};

	beforeEach(async () => {
		const testModule: TestingModule = await Test.createTestingModule({
			providers: [
				AccountService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{
					provide: VerificationService,
					useValue: mockVerificationService
				}
			]
		}).compile();
		service = testModule.get<AccountService>(AccountService);
		prisma = testModule.get<PrismaService>(PrismaService);
		verificationService =
			testModule.get<VerificationService>(VerificationService);

		jest.clearAllMocks();
	});
	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		const input = {
			email: 'new@test.com',
			password: 'password123',
			userName: 'user1'
		};
		it('should successfully create the user and send the token', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(null);
			(hash as jest.Mock).mockResolvedValue('hashed_password');
			const createdUser = {
				indexedDB: 1,
				...input,
				password: 'hashed_password'
			};
			mockPrismaService.user.create.mockResolvedValue(createdUser);
			const result = await service.create(input);
			expect(result).toBe(true);
		});
	});
});
