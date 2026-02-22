import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return this.accountService.findAll();
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async create(
		@Args('createUserInput') createUserInput: CreateUserInput
	) {
		return await this.accountService.create(createUserInput);
	}
}
