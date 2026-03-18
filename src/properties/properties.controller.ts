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
  ParseIntPipe,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(
      '7cb61e42-2064-4310-baf5-313816ed8833',
      dto,
    );
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
  getDashboardStats() {
    return this.propertiesService.getDashboardStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: Partial<CreatePropertyDto>,
  ) {
    return this.propertiesService.update(
      id,
      '7cb61e42-2064-4310-baf5-313816ed8833',
      dto,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(
      id,
      '7cb61e42-2064-4310-baf5-313816ed8833',
    );
  }
}
