import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getProfile(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  updateProfile(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async deleteProfile(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Account deleted successfully' };
  }
}
