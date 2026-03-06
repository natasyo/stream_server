import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, MinLength, Validate } from 'class-validator';
import { IsPasswordsMatchingConstraint } from '@/src/shared/decorators/is-passwords-matching-constraint.decorator';

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordsMatchingConstraint)
	password: string;

	@Field(() => String)
	@IsNotEmpty()
	@MinLength(8)
	passwordRepeat: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsUUID()
	token: string;
}
