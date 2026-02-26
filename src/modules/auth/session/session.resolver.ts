import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '../account/models/user.model';
import type { GqlContext } from '@/src/shared/types/gql-context.types';
import { LoginInput } from './inputs/login.input';
import { UserAgent } from '@/src/shared/decorators/user.agent';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { SessionModel } from '@/src/modules/auth/session/models/session.model';

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	async login(
		@Context() { req }: GqlContext,
		@Args('loginInput') loginInput: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, loginInput, userAgent);
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	@Authorization()
	async logout(@Context() { req }: GqlContext) {
		console.log('logout');
		return this.sessionService.logout(req);
	}

	@Mutation(() => [UserModel], { name: 'getOtherSessions' })
	async getOtherSessions(@Context() { req }: GqlContext) {
		const sessions = await this.sessionService.findByUser(req);
		console.log(sessions);
		return sessions;
	}

	@Authorization()
	@Query(() => [SessionModel], { name: 'findSessionByUser' })
	public async findByUser(@Context() { req }: GqlContext) {
		return this.sessionService.findByUser(req);
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	public async findCurrent(@Context() { req }: GqlContext) {
		return this.sessionService.findCurrent(req);
	}
	@Mutation(() => Boolean, { name: 'clearSessionCookie' })
	@Authorization()
	clearSessionCookie(@Context() { req }: GqlContext) {
		return this.sessionService.clearSession(req);
	}
	@Mutation(() => Boolean, { name: 'removeSession' })
	@Authorization()
	removeSession(@Context() { req }: GqlContext, @Args('id') id: string) {
		return this.sessionService.remove(req, id);
	}
}
