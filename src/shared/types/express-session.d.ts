import 'express-session';

declare module 'express-session' {
	export interface SessionData {
		userId?: string;
		createdAt?: Date | string;
	}
}

declare global {
	namespace Express {
		interface Request {
			user?: UserModel;
		}
	}
}
