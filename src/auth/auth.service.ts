import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Register with Supabase Auth
    const { data, error } = await this.supabase
      .getAdminClient()
      .auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
      });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }

    // 2. Save user in PostgreSQL via Prisma
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        supabaseId: data.user.id,
        employeeId: dto.employeeId,
      },
    });

    // 3. Generate JWT
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        employeeId: user.employeeId,
      },
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    // 1. Authenticate with Supabase
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Find user in our database
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 3. Generate JWT
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        employeeId: user.employeeId,
      },
      access_token: token,
      supabase_token: data.session.access_token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      employeeId: user.employeeId,
    };
  }

  async logout(supabaseToken: string) {
    await this.supabase.getClient().auth.signOut();
    return { message: 'Logged out successfully' };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
