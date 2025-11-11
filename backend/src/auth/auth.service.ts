import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtPayload } from '../declarations';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(loginDto);
    return this.issueTokens(user.id, user.email, user.role, user.barbershopId);
  }

  async issueTokens(
    userId: string,
    email: string,
    role: string,
    barbershopId?: string | null,
  ): Promise<TokenResponseDto> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role: role as any,
      barbershopId: barbershopId ?? null,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('auth.jwtSecret'),
      expiresIn: this.configService.get<string>('auth.jwtExpiresIn'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('auth.refreshSecret'),
      expiresIn: this.configService.get<string>('auth.refreshExpiresIn'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpires(this.configService.get<string>('auth.jwtExpiresIn')),
    };
  }

  async issueTokensFromRefresh(refreshToken: string): Promise<TokenResponseDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('auth.refreshSecret'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found');
      }
      return this.issueTokens(user.id, user.email, user.role, user.barbershopId);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private parseExpires(raw?: string): number {
    if (!raw) return 900;
    if (raw.endsWith('m')) {
      return parseInt(raw.replace('m', ''), 10) * 60;
    }
    if (raw.endsWith('h')) {
      return parseInt(raw.replace('h', ''), 10) * 3600;
    }
    if (raw.endsWith('d')) {
      return parseInt(raw.replace('d', ''), 10) * 86400;
    }
    return parseInt(raw, 10);
  }
}
