import { UserEntity } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_EMAIL_NOT_FOUND_ERROR } from '../auth.constants';
import { JwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate(payload: JwtPayload): Promise<UserEntity> {
		console.log(payload);
		const user = await this.userService.findByCond({
			id: payload.sub,
			email: payload.email,
		});

		// if (!user) {
		// 	throw new UnauthorizedException(USER_EMAIL_NOT_FOUND_ERROR);
		// }

		const { password, ...result } = user;
		return result;
	}
}
