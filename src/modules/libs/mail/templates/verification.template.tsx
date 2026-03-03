import * as React from 'react';
import { Tailwind } from '@react-email/tailwind';
import {
	Html,
	Preview,
	Section,
	Body,
	Head,
	Link,
	Heading
} from '@react-email/components';

interface VerificationTemplateProps {
	domain: string;
	token: string;
}

export function VerificationTemplate({
	domain,
	token
}: VerificationTemplateProps) {
	const verificationUrl = `${domain}/account/verify?token=${token}`;
	return (
		<Html>
			<Head />
			<Preview>Verification email</Preview>
			<Tailwind>
				<Body>
					<Section>
						<Heading>Verify your account</Heading>
						<Link
							href={verificationUrl}
							className={'text-blue-500'}
						>
							Click here to verify
						</Link>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}
