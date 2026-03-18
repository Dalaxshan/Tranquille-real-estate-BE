import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateBranchDto) {
    return this.prisma.branch.create({ data: { ...dto, userId } });
  }

  async findAll() {
    return this.prisma.branch.findMany();
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(id: string, userId: string, dto: Partial<CreateBranchDto>) {
    const branch = await this.findOne(id);
    if (branch.userId !== userId) throw new ForbiddenException();
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const branch = await this.findOne(id);
    if (branch.userId !== userId) throw new ForbiddenException();
    await this.prisma.branch.delete({ where: { id } });
    return { message: `Branch with ID ${id} has been successfully deleted` };
  }
}
