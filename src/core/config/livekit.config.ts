import { TypeLiveKitOptions } from '@/src/modules/libs/livekit/types/livekit.type';
import { ConfigService } from '@nestjs/config/dist/config.service';

export function getLiveKitConfig(
	configService: ConfigService
): TypeLiveKitOptions {
	return {
		apiUrl: configService.getOrThrow<string>('LIVEKIT_URL'),
		apiKey: configService.getOrThrow<string>('LIVEKIT_API_KEY'),
		apiSecret: configService.getOrThrow<string>('LIVEKIT_API_SECRET')
	};
}
