import { isDev } from '@/src/shared/utils/is_dev.util';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export function getGraphQLConfig(
	configService: ConfigService
): ApolloDriverConfig {
	return {
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
		sortSchema: true,
		debug: true,
		playground: isDev(configService),
		path: configService.get<string>('GRAPHQL_PATH') || '/graphql',
		context: ({ req, res }) => ({ req, res })
	};
}
