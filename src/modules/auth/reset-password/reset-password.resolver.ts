import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordInput } from '@/src/modules/auth/reset-password/inputs/reset-password.input';
import { UserAgent } from '@/src/shared/decorators/user.agent';
import { NewPasswordInput } from '@/src/modules/auth/reset-password/inputs/new-password.input';

@Resolver('ResetPassword')
export class ResetPasswordResolver {
	constructor(private readonly resetPasswordService: ResetPasswordService) {}

	@Mutation(() => Boolean)
	async resetPassword(
		@Args('data') input: ResetPasswordInput,
		@UserAgent() userAgent: string
	) {
		return await this.resetPasswordService.resetPassword(input, userAgent);
	}

	@Mutation(() => Boolean)
	async newPassword(@Args('data') input: NewPasswordInput) {
		console.log(input);
		return this.resetPasswordService.newPassword(input);
	}
}
