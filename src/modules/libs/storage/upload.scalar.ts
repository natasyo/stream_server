import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';

@Scalar('Upload')
export class UploadScalar implements CustomScalar<any, any> {
	description = 'Кастомный скаляр для загрузки файлов';

	parseValue(value: any): Promise<FileUpload> {
		return GraphQLUpload.parseValue(value);
	}

	serialize(value: any) {
		return GraphQLUpload.serialize(value);
	}

	parseLiteral(ast: any) {
		return GraphQLUpload.parseLiteral(ast, {});
	}
}
