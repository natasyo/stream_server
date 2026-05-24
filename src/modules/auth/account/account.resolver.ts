import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { Authorized } from '@/src/shared/decorators/autorized.decorator';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { type User } from '@prisma/client';
import { ChangePasswordInput } from '@/src/modules/auth/account/inputs/change-password.input';
import { ChangeEmailInput } from '@/src/modules/auth/account/inputs/change-email.input';

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return this.accountService.findAll();
	}

	@Authorization()
	@Query(() => UserModel, { name: 'getCurrentUser' })
	public async getCurrentUser(@Authorized('id') id: string) {
		console.log('Fetching current user with ID:', id);
		return this.accountService.getCurrentUser(id);
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async create(
		@Args('createUserInput') createUserInput: CreateUserInput
	) {
		return await this.accountService.create(createUserInput);
	}

	@Authorization()
	@Mutation(() => Boolean)
	public async changePassword(
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput
	) {
		return this.accountService.changePasword(user, input);
	}
	@Authorization()
	@Mutation(() => Boolean)
	public async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput
	) {
		return this.accountService.changeEmail(user, input);
	}
}
