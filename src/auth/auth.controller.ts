import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/customDecorators';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@HttpCode(HttpStatus.OK)
	@Post('login')
	@Public()
	signIn(@Body() signInDto: Record<string, any>) {
		return this.authService.signIn(signInDto.credenciales);
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req){
		return req.usuario
	}
}