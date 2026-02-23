import { Prisma } from '@/src/core/prisma/entities/prisma.entity';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	type CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;
		if (typeof request.session?.userId === 'undefined') {
			throw new UnauthorizedException('Unauthorized');
		}
		const user = this.prismaService.user.findUnique({
			where: {
				id: request.session.userId
			}
		});
		request.user = user;
		return true;
	}
}
