import React from 'react';
import { ISessionMetadata } from '@/src/shared/types/session-metadata.types';
import { Head, Heading, Html, Preview, Section } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface DeactivateTemplateProps {
	token: string;
	metadata: ISessionMetadata;
}

function DeactivateTemplate({ token, metadata }: DeactivateTemplateProps) {
	return (
		<Html>
			<Head></Head>
			<Preview>Deactivate account</Preview>
			<Tailwind>
				<Section className={'bg-gray-600'}>
					<Heading>Код подтверждения</Heading>
					<Heading>{token}</Heading>
				</Section>
				<div>
					<p>{metadata.ip}</p>
					<p>{metadata.deviceInfo.browser}</p>
					<p>{metadata.location.country}</p>
				</div>
			</Tailwind>
		</Html>
	);
}

export default DeactivateTemplate;
