import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

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
	@IsOptional()
	@IsString()
	public pin?: string;
}
