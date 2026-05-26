import { Injectable } from '@nestjs/common';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import {PrismaService} from "@/src/core/prisma/prisma.service";

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}
}
