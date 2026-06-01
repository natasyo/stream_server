import { Inject, Injectable } from '@nestjs/common';
import {
	IngressClient,
	RoomServiceClient,
	WebhookReceiver
} from 'livekit-server-sdk';
import {
	LiveKitOptionsSymbol,
	type TypeLiveKitOptions
} from '@/src/modules/libs/livekit/types/livekit.type';

@Injectable()
export class LiveKitService {
	private roomService: RoomServiceClient;
	private ingressClient: IngressClient;
	private webhookReceiver: WebhookReceiver;

	public constructor(
		@Inject(LiveKitOptionsSymbol)
		private readonly options: TypeLiveKitOptions
	) {
		this.roomService = new RoomServiceClient(
			this.options.apiUrl,
			this.options.apiKey,
			this.options.apiSecret
		);
		this.ingressClient = new IngressClient(this.options.apiUrl);
		this.webhookReceiver = new WebhookReceiver(
			this.options.apiKey,
			this.options.apiSecret
		);
	}

	public get ingress(): IngressClient {
		return this.createProxy(this.ingressClient);
	}

	public get room(): RoomServiceClient {
		return this.createProxy(this.roomService);
	}

	public get receiver(): WebhookReceiver {
		return this.createProxy(this.webhookReceiver);
	}

	private createProxy<T extends object>(target: T) {
		return new Proxy(target, {
			get: (obj, prop) => {
				const value = Reflect.get(obj, prop);
				if (typeof value === 'function') {
					return (value as (...args: unknown[]) => unknown).bind(obj);
				}
				return value;
			}
		});
	}
}
