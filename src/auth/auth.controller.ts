import { UserService } from '@app/user/user.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAccessToken } from './types/jwt-access-token.interface';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Post('register')
	async register(@Body() registerAuthDto: RegisterAuthDto): Promise<JwtAccessToken> {
		return this.authService.register(registerAuthDto);
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() { email, password }: LoginAuthDto): Promise<JwtAccessToken> {
		const user = await this.authService.validateUser(email, password);

		return this.authService.login(user);
	}
}
