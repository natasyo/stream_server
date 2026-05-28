import { ConflictException, Injectable } from '@nestjs/common';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { FileUpload } from 'graphql-upload-ts';
import { User } from '@prisma/client';
import sharp from 'sharp';
import { ChangeProfileInput } from '@/src/modules/auth/profile/inputs/change-profile.input';
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from '@/src/modules/auth/profile/inputs/social-link.input';

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	public async changeAvatar(user: User, file: FileUpload) {
		if (user.avatar) {
			await this.storageService.deleteFile(user.avatar);
		}
		const chunks: Buffer[] = [];
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk);
		}
		const buffer = Buffer.concat(chunks);
		const fileName = `/channels/${user.userName}.webp`;
		const isGif = file.filename.endsWith('.gif');
		const processBuffer = await sharp(buffer, { animated: isGif })
			.resize(512, 512)
			.webp()
			.toBuffer();
		await this.storageService.uploadFile(
			fileName,
			processBuffer,
			'webp/image'
		);
		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: fileName }
		});
	}
	public async removeAvatar(user: User) {
		if (!user.avatar) return;
		await this.storageService.deleteFile(user.avatar);
		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: null }
		});
		return true;
	}

	public async changeInfo(user: User, input: ChangeProfileInput) {
		const { username, displayName, bio } = input;

		const userExists = await this.prismaService.user.findUnique({
			where: { userName: username }
		});
		if (!userExists && user.userName !== username) {
			throw new ConflictException('Имя пользователя занято');
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { userName: username, displayName, bio }
		});
		return true;
	}
	public async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input;
		const lastSocialLink = await this.prismaService.socialLink.findFirst({
			where: { userId: user.id },
			orderBy: { position: 'desc' }
		});
		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 0;
		await this.prismaService.socialLink.create({
			data: {
				title,
				position: newPosition,
				url,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		});
		return true;
	}
	public async reorderSocialLinks(list: SocialLinkOrderInput[]) {
		if (!list.length) return;
		const updatePromises = list.map(async (item, index) => {
			return this.prismaService.socialLink.update({
				where: { id: item.id },
				data: { position: item.position }
			});
		});
		await Promise.all(updatePromises);
		return true;
	}

	public async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input;
		await this.prismaService.socialLink.update({
			where: {
				id
			},
			data: {
				title,
				url
			}
		});
		return true;
	}

	public async findSocialLinks(user: User) {
		return this.prismaService.socialLink.findMany({
			where: {
				userId: user.id
			},
			orderBy: { position: 'asc' }
		});
	}

	public async removeSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: {
				id
			}
		});
		return true;
	}
}
