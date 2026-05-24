import React from 'react';
import { Body, Head, Heading, Html, Section } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

function AccountDeletionTemplate() {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body>
					<Section>
						<Heading>ваш аккаунт полностью удален</Heading>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}

export default AccountDeletionTemplate;
