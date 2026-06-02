import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LiveKitService } from '@/src/modules/libs/livekit/livekit.service';

@Injectable()
export class WebhookService {
	constructor(
		readonly prismaService: PrismaService,
		private readonly liveKitService: LiveKitService
	) {}
	public async receiveWebhookLiveKit(body: string, authorization: string) {
		const event = await this.liveKitService.receiver.receive(
			body,
			authorization,
			false
		);

		if (event.event === 'ingress_started') {
			await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: true
				}
			});
		}
		if (event.event === 'ingress_ended') {
			await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: false
				}
			});
		}
	}
}
