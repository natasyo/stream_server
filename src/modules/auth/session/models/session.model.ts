import type {
	IDeviceInfo,
	ILocationInfo,
	ISessionMetadata
} from '@/src/shared/types/session-metadata.types';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationModel implements ILocationInfo {
	@Field(() => String)
	city: string;
	@Field(() => String)
	country: string;
	@Field(() => Number)
	latitude: number;
	@Field(() => Number)
	longitude: number;
}

@ObjectType()
export class DeviceModel implements IDeviceInfo {
	@Field(() => String)
	type: string;
	@Field(() => String)
	browser: string;
	@Field(() => String)
	os: string;
}

@ObjectType()
export class SessionMetadataModel implements ISessionMetadata {
	@Field(() => LocationModel)
	location: LocationModel;

	@Field(() => DeviceModel)
	deviceInfo: DeviceModel;

	@Field(() => String)
	ip: string;
}
@ObjectType()
export class SessionModel {
	@Field(() => ID)
	id: string;
	@Field(() => String)
	userId: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => SessionMetadataModel)
	public metadata: SessionMetadataModel;
}
