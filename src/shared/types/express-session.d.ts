import 'express-session';
import { type ISessionMetadata } from '@/src/shared/types/session-metadata.types';

declare module 'express-session' {
	export interface SessionData {
		userId?: string;
		createdAt: Date | string;
		metadata: ISessionMetadata;
	}
}

declare global {
	namespace Express {
		interface Request {
			user?: UserModel;
		}
	}
}
