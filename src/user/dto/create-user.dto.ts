import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsString()
	fullName: string;

	@IsEmail(null, { message: 'Неверный Email' })
	email: string;

	@IsOptional()
	@Length(6, 32, { message: 'Пароль должен быть не менее символов' })
	@IsString()
	password?: string;
}
