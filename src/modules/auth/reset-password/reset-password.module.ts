import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordResolver } from './reset-password.resolver';

@Module({
  providers: [ResetPasswordResolver, ResetPasswordService],
})
export class ResetPasswordModule {}
