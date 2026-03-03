import { PrismaService } from '@/src/core/prisma/prisma.service';
import { TokenType, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const generateToken = async (
	type: TokenType,
	user: User,
	prismaService: PrismaService,
	isUUID: boolean = false
) => {
	let token: string;
	if (isUUID) {
		token = uuidv4();
	} else {
		token = Math.floor(Math.random() * 900000 + 100000).toString();
	}
	const expiresIn = new Date(new Date().getTime() + 300000);
	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
			user: {
				id: user.id
			}
		}
	});
	if (existingToken) {
		await prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		});
	}

	return prismaService.token.create({
		data: {
			token,
			expiresIn,
			type,
			user: {
				connect: {
					id: user.id
				}
			}
		},
		include: {
			user: true
		}
	});
};
