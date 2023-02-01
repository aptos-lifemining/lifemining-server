import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { multerOptionsFactory } from 'src/utils/multer.options';
import { DailyRecord } from './dailyRecords.entity';
import { Challenge } from './challenges.entity';
import { ChallengesService } from './challenges.service';
import { TotalRecord } from './totalRecords.entity';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // challege 리스트 가져오기
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '챌린지들 가져오기',
    type: Challenge,
    isArray: true,
  })
  retrieveChallengeList() {
    return this.challengesService.retrieveChallengeList();
  }

  // challenge 참여하기
  @Post('/join/:id')
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '챌린지 참여',
    type: TotalRecord,
  })
  @UseGuards(LocalAuthGuard)
  joinChallenge(@Param('id') id: number, @Request() req) {
    return this.challengesService.joinChallenge(id, req.user);
  }

  // challenge 인증
  @Post('/verify/:id')
  @ApiBearerAuth('access_token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'video',
          format: 'binary',
          description: '인증용 동영상 파일',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '챌린지 인증',
    type: DailyRecord,
  })
  @UseInterceptors(FileInterceptor('video', multerOptionsFactory('videos')))
  @ApiConsumes('multipart/form-data')
  @UseGuards(LocalAuthGuard)
  verifyChallenge(
    @Param('id') id: number,
    @UploadedFile()
    video: Express.Multer.File,
    @Request() req,
  ) {
    return this.challengesService.verifyChallenge(req.user, id, video);
  }
}
