import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	type CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@/src/shared/types/gql-context.types';

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext<GqlContext>().req;
		if (typeof request.session?.userId === 'undefined') {
			throw new UnauthorizedException('Unauthorized');
		}
		request.user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId
			}
		});
		return true;
	}
}
