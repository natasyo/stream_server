import { Injectable } from '@nestjs/common';
import { StorageService } from '@/src/modules/libs/storage/storage.service';

@Injectable()
export class ProfileService {
	public constructor(
		private readonly profileService: ProfileService,
		private readonly storageService: StorageService
	) {}
}
