import { UserEntity } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
	REGISTRATION_ERROR,
	USER_EMAIL_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAccessToken } from './types/jwt-access-token.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async validateUser(
		email: string,
		password: string,
	): Promise<Omit<UserEntity, 'password'> | null> {
		const user = await this.userRepository.findOne(
			{
				email,
				password,
			},
			{ select: ['id', 'fullName', 'email', 'createdAt', 'updatedAt', 'password'] },
		);

		if (!user) {
			throw new UnauthorizedException(USER_EMAIL_NOT_FOUND_ERROR);
		}

		if (user.password !== password) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		const { password: ps, ...result } = user;
		return result;
	}

	async login(user: UserEntity): Promise<UserEntity & JwtAccessToken> {
		return {
			...(await this.generateJwtToken(user.email, user.id)),
			...user,
		};
	}

	async register({
		email,
		fullName,
		password,
	}: RegisterAuthDto): Promise<UserEntity & JwtAccessToken> {
		try {
			const user = await this.userService.create({
				email,
				fullName,
				password,
			});

			return {
				...user,
				...(await this.generateJwtToken(user.email, user.id)),
			};
		} catch (e) {
			throw new ForbiddenException(REGISTRATION_ERROR);
		}
	}

	async generateJwtToken(email: string, id: number): Promise<JwtAccessToken> {
		const payload = { email: email, sub: id };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
