import { type ISessionMetadata } from '@/src/shared/types/session-metadata.types';
import { type Request } from 'express';
import { IS_DEV_ENV } from '@/src/shared/utils/is_dev.util';
import { lookup } from 'geoip-lite';
import DeviceDetector from 'device-detector-js';
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

function getClientIp(req: Request): string {
	if (IS_DEV_ENV) return '173.166.164.121';
	const cfIp = req.headers['cf-connecting-ip'];
	if (typeof cfIp === 'string') return cfIp;

	const forwarder = req.headers['x-forwarded-for'];
	if (typeof forwarder === 'string') return forwarder.split(',')[0].trim();
	return req.ip || '';
}

countries.registerLocale(enLocale);
export function getSessionMetadata(
	req: Request,
	userAgent: string
): ISessionMetadata {
	const ip = getClientIp(req);
	const location = lookup(ip);
	const deviceDetector = new DeviceDetector().parse(userAgent);
	return {
		location: {
			country: location
				? countries.getName(location.country, 'en') || 'Unknow'
				: 'Unknown',
			city: location?.city || 'Unknown',
			latitude: location?.ll?.[0] || 0,
			longitude: location?.ll?.[1] || 0
		},
		deviceInfo: {
			browser: deviceDetector.client?.name || '',
			os: deviceDetector.os?.name || '',
			type: deviceDetector.device?.type || ''
		},
		ip
	};
}
