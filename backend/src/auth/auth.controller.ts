//Definiamo gli endpoint REST esposti dal BE
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') //prefissa tutti gli endpoint con /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') //riceve email e password, restituisce il token JWT
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me') //endpoint protetto che restituisce i dati dell'utente attualmente loggato
  @UseGuards(AuthGuard('jwt'))
  me(@Request() req) {
    return req.user;
  }
}