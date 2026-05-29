import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { FiltersInput } from '@/src/modules/stream/inputs/filters.input';

@Injectable()
export class StreamService {
	constructor(private readonly prismaService: PrismaService) {}

	public async findAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input;
		return this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 10,
			where: {
				user: {
					isDeactivated: false
				}
			},
			include: {
				user: {
					where: {
						isDeactivated: false
					}
				}
			}
		});
	}
}
