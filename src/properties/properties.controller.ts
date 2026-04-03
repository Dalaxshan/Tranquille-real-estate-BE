import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(dto);
  }

  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
  ) {
    return this.propertiesService.findAll({ city, type, category });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getDashboardStats() {
    return this.propertiesService.getDashboardStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: Partial<CreatePropertyDto>,
  ) {
    return this.propertiesService.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.propertiesService.remove(id, req.user.id);
  }
}
