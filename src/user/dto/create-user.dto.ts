import { UniqueOnDatabase } from '@app/auth/decorators/unique-validation';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
	@IsString()
	fullName: string;

	@IsEmail()
	@UniqueOnDatabase(UserEntity, { message: 'Такой email уже существует' })
	email: string;

	@IsOptional()
	@Length(6, 32, { message: 'Пароль должен быть не менее 6 символов' })
	@IsString()
	password?: string;
}
