import { InputType, Field } from '@nestjs/graphql';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength
} from 'class-validator';

@InputType()
export class CreateUserInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only contain letters, numbers, and underscores'
	})
	userName: string;
	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;
}
