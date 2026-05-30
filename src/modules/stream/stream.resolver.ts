import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from '@/src/modules/stream/models/stream.model';
import { FiltersInput } from '@/src/modules/stream/inputs/filters.input';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/autorized.decorator';
import type { User } from '@prisma/client';
import { ChangeStreamInfoInput } from '@/src/modules/stream/inputs/change-stream-info.input';
import { UploadParam } from '@/src/shared/decorators/upload.param.decorator';
import type { FileUpload } from 'graphql-upload-ts';

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel])
	public async findAll(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input);
	}

	@Query(() => [StreamModel, { name: 'findRandomStreams' }])
	public async findRandom() {
		return this.streamService.findAll();
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	public async changeThumbail(
		@Authorized() user: User,
		@UploadParam('thumbail') thumbail: FileUpload
	) {
		return this.streamService.changeThumbnail(user, thumbail);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbail' })
	public async removeThumbail(@Authorized() user: User) {
		return this.streamService.removeThumbail(user);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInfoInput
	) {
		return this.streamService.changeInfo(user, input);
	}
}
