//Definiamo gli endpoint REST esposti dal BE
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth') //prefissa tutti gli endpoint con /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') //riceve email e password, restituisce il token JWT
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register') //riceve i dati del nuovo utente, lo crea nel database (usato dall'admin per creare nuove utenze)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('me') //endpoint protetto che restituisce i dati dell'utente attualmente loggato
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() req) {
    return req.user;
  }
}