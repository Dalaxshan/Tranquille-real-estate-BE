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

  async create(dto: CreatePropertyDto) {
    const { blueprint, agent, statistics, ...rest } = dto;
    return await this.prisma.property.create({
      data: {
        ...rest,
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
        ...(filters?.type && { landType: filters.type as any }),
        ...(filters?.category && { category: filters.category as any }),
      },
      include: {
        agent: true,
        _count: {
          select: { reviews: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        blueprint: true,
        agent: true,
        reviews: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async update(id: number, userId: string, dto: Partial<CreatePropertyDto>) {
    const property = await this.prisma.property.findUnique({ where: { id } });

    if (!property) throw new NotFoundException('Property not found');
    if (property.userId !== userId) throw new ForbiddenException();

    const { blueprint, agent, statistics, ...rest } = dto;

    const cleanBlueprint = blueprint
      ? (({ id, propertyId, ...b }: any) => b)(blueprint)
      : null;

    const cleanAgent = agent
      ? (({ id, propertyId, ...a }: any) => a)(agent)
      : null;

    return await this.prisma.property.update({
      where: { id },
      data: {
        ...rest,
        ...(cleanBlueprint && {
          blueprint: {
            upsert: {
              create: cleanBlueprint,
              update: cleanBlueprint,
            },
          },
        }),
        ...(cleanAgent && {
          agent: {
            upsert: {
              create: cleanAgent,
              update: cleanAgent,
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

  async remove(id: number, userId: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.userId !== userId) throw new ForbiddenException();
    await this.prisma.property.delete({ where: { id } });
    return { message: `Property id: ${id} deleted` };
  }

  async getDashboardStats() {
    const [totalProperties, totalBranches] = await this.prisma.$transaction([
      this.prisma.property.count(),
      this.prisma.branch.count(),
    ]);

    return {
      totalProperties,
      totalBranches,
    };
  }
}
