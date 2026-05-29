import { Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from '@/src/modules/stream/models/stream.model';

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel])
	public async findAll() {
		return this.streamService.findAll();
	}
}
