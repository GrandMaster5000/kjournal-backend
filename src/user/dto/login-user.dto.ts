import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
	@IsEmail(undefined, { message: 'Неверный Email' })
	email: string;

	@Length(6, 32, { message: 'Пароль должен быть не менее символов' })
	@IsString()
	password: string;
}
