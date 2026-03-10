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
      '36e0ab06-17d5-4443-a93b-9e56132cb345',
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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: Partial<CreatePropertyDto>,
  ) {
    return this.propertiesService.update(
      id,
      '36e0ab06-17d5-4443-a93b-9e56132cb345',
      dto,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.remove(
      id,
      '36e0ab06-17d5-4443-a93b-9e56132cb345',
    );
  }
}
