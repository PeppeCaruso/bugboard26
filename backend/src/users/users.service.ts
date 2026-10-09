import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    // normalizza l'email: le email non distinguono maiuscole e minuscole
    const email = dto.email.trim().toLowerCase();

    const existing = await this.userRepository.findOne({
      where: { email },
    });
    if (existing) throw new ConflictException('Email già in uso');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email,
      password: hashedPassword,
      role: dto.role as UserRole,
    });

    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}