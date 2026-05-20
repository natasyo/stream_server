import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { DeactivateService } from './deactivate.service';
import type { GqlContext } from '@/src/shared/types/gql-context.types';
import { DeactivateAccountInput } from '@/src/modules/auth/deactivate/inputs/deactivate-account.input';
import { Authorized } from '@/src/shared/decorators/autorized.decorator';
import type { User } from '@prisma/client';
import { UserAgent } from '@/src/shared/decorators/user.agent';
import { AuthModel } from '@/src/modules/auth/account/models/auth.model';
import { Authorization } from '@/src/shared/decorators/auth.decorator';

@Resolver('Deactivate')
export class DeactivateResolver {
	constructor(private readonly deactivateService: DeactivateService) {}

	@Authorization()
	@Mutation(() => AuthModel, { name: 'deactivateAccount' })
	public async deactivate(
		@Context() { req }: GqlContext,
		@Args('data') input: DeactivateAccountInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.deactivateService.deactivateAccount(
			req,
			input,
			user,
			userAgent
		);
	}
}
