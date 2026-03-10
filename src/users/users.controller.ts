import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('me')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Delete('me')
  deleteProfile(@Request() req) {
    return this.usersService.deleteProfile(req.user.id);
  }
}
