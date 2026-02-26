import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserAgent = createParamDecorator(
	(data: any, ctx: ExecutionContext) => {
		if (ctx.getType() === 'http') {
			const request = ctx.switchToHttp().getRequest<Request>();
			return request.headers['user-agent'];
		} else {
			const context = GqlExecutionContext.create(ctx);
			return context.getContext<{ req: Request }>().req.headers[
				'user-agent'
			];
		}
	}
);
