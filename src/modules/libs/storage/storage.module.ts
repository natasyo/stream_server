import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UploadScalar } from '@/src/modules/libs/storage/upload.scalar';

@Global()
@Module({
	providers: [StorageService, UploadScalar],
	exports: [StorageService]
})
export class StorageModule {}
