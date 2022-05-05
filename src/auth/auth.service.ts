import { UserEntity } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_EMAIL_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAccessToken } from './types/jwt-access-token.interface';
import { JwtPayload } from './types/jwt-payload.interface';

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

	async login(user: UserEntity): Promise<JwtAccessToken> {
		return this.generateJwtToken(user.email, user.id);
	}

	async register(registerAuthDto: RegisterAuthDto): Promise<JwtAccessToken> {
		try {
			const user = await this.userService.create(registerAuthDto);

			return this.generateJwtToken(user.email, user.id);
		} catch (e) {
			throw new ForbiddenException();
		}
	}

	async generateJwtToken(email: string, id: number): Promise<JwtAccessToken> {
		const payload = { email: email, sub: id };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
