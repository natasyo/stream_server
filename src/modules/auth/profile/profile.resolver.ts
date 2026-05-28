import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Authorized } from '@/src/shared/decorators/autorized.decorator';
import { type FileUpload } from 'graphql-upload-ts';
import { type User } from '@prisma/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { UploadParam } from '@/src/shared/decorators/upload.param.decorator';
import { ChangeProfileInput } from '@/src/modules/auth/profile/inputs/change-profile.input';
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from '@/src/modules/auth/profile/inputs/social-link.input';
import { SocialLinkModel } from '@/src/modules/auth/profile/models/social-link.model';

@Resolver('Profile')
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}

	@Mutation(() => Boolean)
	@Authorization()
	public async changeAvatar(
		@Authorized() user: User,
		@UploadParam('avatar') avatar: FileUpload
	) {
		return await this.profileService.changeAvatar(user, avatar);
	}

	@Mutation(() => Boolean)
	@Authorization()
	public async removeAvatar(@Authorized() user: User) {
		return await this.profileService.removeAvatar(user);
	}

	@Authorization()
	@Mutation(() => Boolean)
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeProfileInput
	) {
		return this.profileService.changeInfo(user, input);
	}

	@Authorization()
	@Mutation(() => Boolean)
	public async createSocialLink(
		@Authorized() user: User,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.createSocialLink(user, input);
	}

	@Authorization()
	@Mutation(() => Boolean)
	public async reorderSocialLink(
		@Args('list', { type: () => [SocialLinkOrderInput] })
		input: SocialLinkOrderInput[]
	) {
		return this.profileService.reorderSocialLinks(input);
	}

	@Authorization()
	@Mutation(() => Boolean)
	public async updateSocialLink(
		@Args('id') id: string,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.updateSocialLink(id, input);
	}

	@Authorization()
	@Mutation(() => Boolean)
	public async removeSocialLink(@Args('id') id: string) {
		return this.profileService.removeSocialLink(id);
	}

	@Authorization()
	@Query(() => SocialLinkModel)
	public async findSocialLinks(@Authorized() user: User) {
		return this.profileService.findSocialLinks(user);
	}
}
