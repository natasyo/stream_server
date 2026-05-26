import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import {StorageModule} from "@/src/modules/libs/storage/storage.module";

@Module({
	providers: [ProfileResolver, ProfileService],
	imports:[StorageModule]
})
export class ProfileModule {}
