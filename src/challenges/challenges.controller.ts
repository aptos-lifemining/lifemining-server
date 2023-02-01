import {
  Body,
  Controller,
  HttpCode,
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
import { ChallengeHistory } from './challengeHistories.entity';
import { ChallengesService } from './challenges.service';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // challeng 인증
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
    description: '비디오 업로드',
    type: ChallengeHistory,
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
    console.log('verifyChallenge >>>>>>');
    console.log('video >>>>>>', video);
    console.log('id >>>>>>> ', id);
    return this.challengesService.verifyChallenge(req.user, id, video);
  }
}
