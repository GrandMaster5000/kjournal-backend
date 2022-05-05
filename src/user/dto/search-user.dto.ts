import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchUserDto {
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	fullName?: string;

	@IsOptional()
	@IsNumber()
	skip = 0;

	@IsOptional()
	@IsNumber()
	take = 10;
}
