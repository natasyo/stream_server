// @flow
import * as React from 'react';
import { Body, Heading, Html, Link } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
interface ResetPasswordTemplateProps {
	domain: string;
	token: string;
	userAgent: string;
}

export function ResetPasswordTemplate({
	domain,
	token,
	userAgent
}: ResetPasswordTemplateProps) {
	return (
		<Html>
			<Heading />
			<Tailwind>
				<Body>
					<Link
						href={`${domain}/account/reset-password/${token}`}
						className={`block`}
					>
						Reset password
					</Link>
					<ul>
						<li>User agent {userAgent}</li>
					</ul>
				</Body>
			</Tailwind>
		</Html>
	);
}
