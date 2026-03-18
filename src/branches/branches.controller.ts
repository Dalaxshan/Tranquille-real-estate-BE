import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  // UseGuards,
  Request,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('branches')
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateBranchDto) {
    return this.branchesService.create(
      '7cb61e42-2064-4310-baf5-313816ed8833',
      dto,
    );
  }

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: Partial<CreateBranchDto>,
  ) {
    return this.branchesService.update(
      id,
      '7cb61e42-2064-4310-baf5-313816ed8833',
      dto,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.branchesService.remove(
      id,
      '7cb61e42-2064-4310-baf5-313816ed8833',
    );
  }
}
