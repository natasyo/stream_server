import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User;
		if (ctx.getType() === 'http') {
			const request = ctx.switchToHttp().getRequest<Request>();
			user = request.user;
		} else {
			const gqlCtx = GqlExecutionContext.create(ctx);
			console.log(gqlCtx.getContext<GqlContext>().req);
			user = gqlCtx.getContext<GqlContext>().req.user as User;
			console.log('user ', user);
		}
		return data ? user[data] : user;
	}
);
