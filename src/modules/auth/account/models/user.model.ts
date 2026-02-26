import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { User } from '@prisma/client';

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	email: string;

	@Field(() => String)
	password: string;

	@Field(() => String)
	userName: string;

	@Field(() => String, { nullable: true })
	displayName: string | null;

	@Field(() => String, { nullable: true })
	name: string | null;

	@Field(() => String, { nullable: true })
	avatar: string | null;

	@Field(() => String, { nullable: true })
	bio: string | null;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
