import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePropertyDto) {
    const { blueprint, agent, statistics, ...rest } = dto;
    return await this.prisma.property.create({
      data: {
        ...rest,
        userId,
        ...(blueprint && { blueprint: { create: blueprint } }),
        ...(agent && { agent: { create: agent } }),
        ...(statistics && {
          statistics: {
            create: {
              views: { create: statistics.views || [] },
              priceHistory: { create: statistics.priceHistory || [] },
            },
          },
        }),
      },
      include: {
        blueprint: true,
        agent: true,
        statistics: true,
        reviews: true,
      },
    });
  }

  async findAll(filters?: { city?: string; type?: string; category?: string }) {
    return await this.prisma.property.findMany({
      where: {
        ...(filters?.city && { city: filters.city as any }),
        ...(filters?.type && { type: filters.type as any }),
        ...(filters?.category && { category: filters.category as any }),
      },
      include: {
        blueprint: true,
        agent: true,
        statistics: { include: { views: true, priceHistory: true } },
        reviews: true,
      },
    });
  }

  async findOne(id: number) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        blueprint: true,
        agent: true,
        statistics: { include: { views: true, priceHistory: true } },
        reviews: true,
      },
    });
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async update(id: number, userId: string, dto: Partial<CreatePropertyDto>) {
    const property = await this.prisma.property.findUnique({ where: { id } });

    if (!property) throw new NotFoundException('Property not found');
    if (property.userId !== userId) throw new ForbiddenException();
    const { blueprint, agent, ...rest } = dto || {};
    return await this.prisma.property.update({
      where: { id },
      data: {
        ...rest,
        ...(blueprint && {
          blueprint: { upsert: { create: blueprint, update: blueprint } },
        }),
        ...(agent && { agent: { upsert: { create: agent, update: agent } } }),
      },
      include: {
        blueprint: true,
        agent: true,
        statistics: true,
        reviews: true,
      },
    });
  }

  async remove(id: number, userId: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.userId !== userId) throw new ForbiddenException();
    await this.prisma.property.delete({ where: { id } });
    return { message: `Property id: ${id} deleted` };
  }
}
