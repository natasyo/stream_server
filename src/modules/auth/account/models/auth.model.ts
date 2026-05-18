import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

@ObjectType()
export class AuthModel {
	@Field(() => String, { nullable: true })
	public message?: string;

	@Field(() => UserModel, { nullable: true })
	public user?: UserModel;
}
