import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  HttpStatus,
  UseInterceptors,
  HttpCode,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/utils/multer.options';
import { CreateUserDTO } from './users.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth('access_token')
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: '내 정보를 가져온다', type: User })
  findOneByAccessToken(@Request() req): User {
    return req.user;
  }

  // 회원가입
  @Post('/register')
  @ApiBearerAuth('access_token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        handle: {
          type: 'string',
          example: 'CoolJohn',
          description: '유저 핸들',
        },
        address: {
          type: 'string',
          example: '0x1234567890123456789012345678901234567890',
          description: '유저 지갑 주소',
        },
        description: {
          type: 'string',
          example: '안녕하세요',
          description: '유저 소개',
        },
        profileImage: {
          type: 'file',
          format: 'binary',
          description: '프로필 이미지 파일',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      '회원 가입 - 프로필 이미지는 파일로 전달하면 s3에 업로드 후 url을 저장',
    type: User,
  })
  @UseInterceptors(
    FileInterceptor('profileImage', multerOptionsFactory('profile-images')),
  )
  @HttpCode(HttpStatus.OK)
  register(
    @UploadedFile() profileImage,
    @Body() body: CreateUserDTO,
  ): Promise<User> {
    return this.usersService.register(body, profileImage);
  }

  // 유저들 가져오기
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '유저들 가져오기',
    type: User,
    isArray: true,
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // 내 프로필 업그레이드
  @Post('/upgrade')
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '내 프로필 업그레이드',
    type: User,
  })
  @UseGuards(LocalAuthGuard)
  upgrade(@Request() req): Promise<User> {
    return this.usersService.upgrade(req.user);
  }

  // 내 프로필 다운그레이드
  @Post('/downgrade')
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '내 프로필 다운그레이드',
    type: User,
  })
  @UseGuards(LocalAuthGuard)
  downgrade(@Request() req): Promise<User> {
    return this.usersService.downgrade(req.user);
  }

  // 모든 기록 리셋
  @Post('/reset')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        handle: {
          type: 'string',
          example: 'jiwoo',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '모든 기록 리셋',
    type: null,
  })
  reset(@Body() body) {
    return this.usersService.reset(body.handle);
  }
}
