import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { VerificationModule } from '@/src/modules/auth/verification/verification.module';

@Module({
	providers: [AccountResolver, AccountService],
	imports: [VerificationModule]
})
export class AccountModule {}
