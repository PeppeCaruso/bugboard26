import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  // eseguito automaticamente all'avvio dell'applicazione
  async onApplicationBootstrap(): Promise<void> {
    const adminCount = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });
    if (adminCount > 0) return;

    // normalizza l'email: le email non distinguono maiuscole e minuscole
    const email = (this.configService.get<string>('ADMIN_EMAIL') ?? 'admin@bugboard.com')
      .trim()
      .toLowerCase();
    const password = this.configService.get<string>('ADMIN_PASSWORD') ?? 'Admin1234!';

    const admin = this.userRepository.create({
      email,
      password: await bcrypt.hash(password, 10),
      firstName: 'Mario',
      lastName: 'Rossi',
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(admin);

    this.logger.log(`Account amministratore di default creato: ${email}`);
  }
}