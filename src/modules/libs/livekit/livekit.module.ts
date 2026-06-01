import { DynamicModule, Module } from '@nestjs/common';
import { LiveKitService } from './livekit.service';
import {
	LiveKitOptionsSymbol,
	TypeLiveKitAsyncOptions,
	TypeLiveKitOptions
} from '@/src/modules/libs/livekit/types/livekit.type';

@Module({})
export class LiveKitModule {
	public static register(options: TypeLiveKitOptions): DynamicModule {
		return {
			module: LiveKitModule,
			providers: [
				{
					provide: LiveKitOptionsSymbol,
					useValue: options
				},
				LiveKitService
			],
			exports: [LiveKitService],
			global: true
		};
	}
	public static registerAsync(
		options: TypeLiveKitAsyncOptions
	): DynamicModule {
		return {
			module: LiveKitModule,
			imports: options.imports || [],
			providers: [
				{
					provide: LiveKitOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || []
				},
				LiveKitService
			],
			exports: [LiveKitService],
			global: true
		};
	}
}
