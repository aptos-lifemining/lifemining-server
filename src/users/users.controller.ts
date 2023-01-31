import { Controller, Request, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiBearerAuth('access_token')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: '내 정보를 가져온다', type: User })
  findOneByAccessToken(@Request() req): User {
    return req.user;
  }
}
