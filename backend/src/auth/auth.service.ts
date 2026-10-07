import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //registrazione
  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email già in uso');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: (registerDto.role as UserRole) || UserRole.USER,
    });

    return this.userRepository.save(user);
  }

  //login
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
  const user = await this.userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email: loginDto.email })
    .getOne();

  if (!user) {
    throw new UnauthorizedException('Credenziali non valide');
  }

  const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Credenziali non valide');
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    access_token: this.jwtService.sign(payload),
  };
}

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}