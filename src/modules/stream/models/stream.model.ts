import { Stream } from '@prisma/client';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	id: string;
	@Field(() => String)
	title: string;
	@Field(() => String, { nullable: true })
	thumbaiUrl: string | null;
	@Field(() => String, { nullable: true })
	ingressId: string | null;
	@Field(() => String, { nullable: true })
	serverUrl: string | null;
	@Field(() => String, { nullable: true })
	streamKey: string | null;
	@Field(() => Boolean)
	isLive: boolean;
	@Field(() => Date)
	createdAt: Date;
	@Field(() => Date)
	updatedAt: Date;
	@Field(() => String, { nullable: true })
	userId: string | null;
}
