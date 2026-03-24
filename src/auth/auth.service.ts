import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private supabase;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL') || '',
      config.get<string>('SUPABASE_ANON_KEY') || '',
    );
  }

  async register(dto: RegisterDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) throw new ConflictException('Email already in use');

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername)
      throw new ConflictException('Username already in use');

    const existingEmployeeId = await this.prisma.user.findUnique({
      where: { employeeId: dto.employeeId },
    });
    if (existingEmployeeId)
      throw new ConflictException('Employee ID already in use');

    // 1. Create user in Supabase Auth
    const { data, error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error) throw new BadRequestException(error.message);

    // 2. Save extra user info in DB
    const user = await this.prisma.user.create({
      data: {
        supabaseId: data.user.id,
        username: dto.username,
        email: dto.email,
        employeeId: dto.employeeId,
      },
    });

    return { message: 'Registration successful. Check email to verify.', user };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    const userData = await this.getProfile(data.session.access_token);

    console.log('Login data:', data);
    if (error) throw new UnauthorizedException(error.message);

    return {
      message: 'Login successful',
      user: userData,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }

  async getProfile(token: string) {
    const user = await this.verifyToken(token);
    const profile = await this.prisma.user.findUnique({
      where: { supabaseId: user.id },
    });
    return profile;
  }

  async verifyToken(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) throw new UnauthorizedException('Invalid token');
    return data.user;
  }

  async logout(token: string) {
    const client = createClient(
      this.config.get<string>('SUPABASE_URL') || '',
      this.config.get<string>('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    await client.auth.signOut();
    return { message: 'Logged out successfully' };
  }
}
