import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post('login')
	async login(@Body() { email, password }: AuthDto): Promise<{ access_token: string }> {
		const user = await this.authService.validateUser(email, password);

		return this.authService.login(user);
	}
}
