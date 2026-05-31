import {AccountService} from '@/src/modules/auth/account/account.service';
import {Test, TestingModule} from '@nestjs/testing';
import {hash, verify} from 'argon2';
import {PrismaService} from '@/src/core/prisma/prisma.service';
import {VerificationService} from '@/src/modules/auth/verification/verification.service';
import {ConflictException} from "@nestjs/common";

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
                {provide: PrismaService, useValue: mockPrismaService},
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
        it('should throw ConflictException if email already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValueOnce({
                id: 1
            })
            await expect(service.create(input)).rejects.toThrow(new ConflictException('Email already exists'))
            expect(mockPrismaService.user.create).not.toHaveBeenCalled();
        })
        it('should throw ConflictException if username already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
                id: 1
            })
            await expect(service.create(input)).rejects.toThrow(new ConflictException('Username already exists'))
            expect(mockPrismaService.user.create).not.toHaveBeenCalled();
        })
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
            expect(hash).toHaveBeenCalledWith(input.password);
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: input.email,
                    password: 'hashed_password',
                    userName: input.userName,
                    displayName: input.userName,
                    stream: {
                        create: {
                            title: `Stream ${input.userName}`
                        }
                    }
                }
            })
        });
    });
});
