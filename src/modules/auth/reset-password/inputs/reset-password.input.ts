import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class ResetPasswordInput {
	@Field()
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
