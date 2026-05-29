import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
	private s3Client: S3Client;
	private readonly bucket: string;
	public constructor(private readonly configService: ConfigService) {
		this.s3Client = new S3Client({
			endpoint: configService.getOrThrow<string>('S3_ENDPOINT'),
			region: configService.getOrThrow<string>('S3_REGION'),
			credentials: {
				accessKeyId: configService.getOrThrow<string>('S3_ACCESS_KEY'),
				secretAccessKey:
					configService.getOrThrow<string>('S3_SECRET_KEY_ID')
			},
			forcePathStyle: true
		});
		this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
	}
	public async uploadFile(key: string, fileBuffer: Buffer, mimeType: string) {
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: String(key),
			Body: fileBuffer,
			ContentType: mimeType
		});

		return await this.s3Client.send(command);
	}

	public async deleteFile(key: string) {
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: String(key)
		});
		return await this.s3Client.send(command);
	}
}
