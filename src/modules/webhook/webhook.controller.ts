import {
	BadRequestException,
	Controller,
	HttpCode,
	HttpStatus,
	Body,
	Post,
	Headers
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
	constructor(private readonly webhookService: WebhookService) {}
	@Post('livikit')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookLiveKit(
		@Body() body: string, // NestJS распарсит JSON сюда
		@Headers('Authorization') authorization: string
	) {
		if (!authorization) {
			throw new BadRequestException('Authorization not found');
		}
		return this.webhookService.receiveWebhookLiveKit(body, authorization);
	}
}
