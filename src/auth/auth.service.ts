import { UserEntity } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async validateUser(
		email: string,
		password: string,
	): Promise<Omit<UserEntity, 'password'> | null> {
		const user = await this.userService.findByCond({
			email,
			password,
		});

		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		if (user.password !== password) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		const { password: ps, ...result } = user;
		return result;
	}
}
