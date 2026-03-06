import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator';
import { ResetPasswordInput } from '@/src/modules/auth/reset-password/inputs/reset-password.input';
import { NewPasswordInput } from '@/src/modules/auth/reset-password/inputs/new-password.input';

@ValidatorConstraint({
	name: 'IsPasswordsMatchingConstraint',
	async: false
})
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
	validate(
		passwordRepeat: string,
		validationArguments?: ValidationArguments
	): Promise<boolean> | boolean {
		const object = validationArguments?.object as NewPasswordInput;
		return object.password === passwordRepeat;
	}
	defaultMessage(): string {
		return 'Password is not registered.';
	}
}
