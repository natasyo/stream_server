import { Args } from '@nestjs/graphql';
import { UploadScalar } from '@/src/modules/libs/storage/upload.scalar';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';

export const UploadParam = (name: string = 'file') =>
	Args(name, { type: () => UploadScalar }, FileValidationPipe);
