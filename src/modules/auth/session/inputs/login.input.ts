import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	login: string;

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;

	@Field(() => String, { nullable: true })
	@IsString()
	public pin?: string;
}
