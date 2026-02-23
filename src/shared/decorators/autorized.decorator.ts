import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const Authorizaed = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User;
		if (ctx.getType() === 'http') {
			const request = ctx.switchToHttp().getRequest();
			user = request.user;
		} else {
			const gqlCtx = ctx.getArgByIndex(2);
			user = gqlCtx.req.user;
		}
		return data ? user[data] : user;
	}
);
