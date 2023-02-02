import {
  Body,
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
import { CreateChallengeDTO } from './challenges.dto';

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

  // 내가 참여중인 totalRecords 가져오기
  @Get('/totalRecords')
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '내가 참여중인 챌린지들의 totalRecords 가져오기',
    type: TotalRecord,
    isArray: true,
  })
  @UseGuards(LocalAuthGuard)
  retrieveMyTotalRecords(@Request() req) {
    return this.challengesService.retrieveMyTotalRecords(req.user);
  }

  // 특정 챌린지의 내가 참여중인 totalRecord 가져오기
  @Get(':id/totalRecord')
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 챌린지의 내가 참여중인 totalRecord 가져오기',
    type: TotalRecord,
  })
  @UseGuards(LocalAuthGuard)
  retrieveTotalRecord(@Request() req, @Param('id') id: number) {
    return this.challengesService.retrieveTotalRecord(req.user, id);
  }

  // 특정 challenge id로 가져오기
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 챌린지 가져오기',
    type: Challenge,
  })
  retrieveChallenge(@Param('id') id: number) {
    return this.challengesService.retrieveChallenge(id);
  }

  // challenge 열기
  @Post()
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '챌린지 생성',
    type: Challenge,
  })
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', multerOptionsFactory('challenge-images')),
  )
  createChallenge(
    @Request() req,
    @Body() body: CreateChallengeDTO,
    @UploadedFile() image,
  ) {
    return this.challengesService.createChallenge(req.user, body, image);
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
        video: {
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

  // challenge 클레임
  @Post('/claim/:id')
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '챌린지 클레임',
    type: TotalRecord,
  })
  @UseGuards(LocalAuthGuard)
  async claimChallenge(
    @Param('id') id: number,
    @Request() req,
  ): Promise<TotalRecord> {
    return this.challengesService.claimChallenge(id, req.user);
  }
}
