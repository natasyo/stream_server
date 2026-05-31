import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { FiltersInput } from '@/src/modules/stream/inputs/filters.input';
import { Prisma, Stream, User } from '@prisma/client';
import { ChangeStreamInfoInput } from '@/src/modules/stream/inputs/change-stream-info.input';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { FileUpload, Upload } from 'graphql-upload-ts';
import sharp from 'sharp';

@Injectable()
export class StreamService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	private findBySearchTermFilter(
		searchTerm: string
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					user: {
						userName: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				}
			]
		};
	}

	private async findByUserId(user: User) {
		return this.prismaService.stream.findUnique({
			where: {
				userId: user.id
			}
		});
	}

	public async findAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input;

		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined;

		return this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 10,
			where: {
				user: {
					isDeactivated: false
				},
				...whereClause
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

	public async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false
				}
			}
		});

		const randomIndexes = new Set<number>();
		while (randomIndexes.size < 4) {
			const randomIndex = Math.floor(Math.random() * total);
			randomIndexes.add(randomIndex);
		}
		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false
				}
			},
			include: {
				user: true
			},
			take: total,
			skip: 0
		});
		return Array.from(randomIndexes).map(index => streams[index]);
	}

	public async changeInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input;
		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				title
			}
		});
		return true;
	}

	public async changeThumbnail(user: User, file: FileUpload) {
		const stream = await this.findByUserId(user);
		if (!stream) {
			throw new NotFoundException('Stream does not found');
		}
		if (stream.thumbnailUrl) {
			await this.storageService.deleteFile(stream.thumbnailUrl);
		}
		const chunks: Buffer[] = [];
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk);
		}
		const buffer = Buffer.concat(chunks);
		const fileName = `/streams/${user.userName}.webp`;
		const isGif = file.filename.endsWith('.gif');
		const processBuffer = await sharp(buffer, { animated: isGif })
			.resize(1280, 720)
			.webp()
			.toBuffer();
		await this.storageService.uploadFile(
			fileName,
			processBuffer,
			'webp/image'
		);
		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: fileName }
		});
		return true;
	}
	public async removeThumbail(user: User) {
		const stream = await this.findByUserId(user);
		if (!stream) {
			throw new NotFoundException('Stream does not found');
		}
		if (!stream.thumbnailUrl) return;
		await this.storageService.deleteFile(stream.thumbnailUrl);
		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: null }
		});
		return true;
	}
}
