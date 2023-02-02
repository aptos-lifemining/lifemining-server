import { ApiProperty, PickType } from '@nestjs/swagger';
import { Challenge } from './challenges.entity';

export class VerifyChallengeDTO {
  @ApiProperty({
    example: 1,
    description: '챌린지 ID',
  })
  challengeId: number;
}

export class CreateChallengeDTO extends PickType(Challenge, [
  'title',
  'subTitle',
  'description',
  'totalDays',
  'passDays',
  'type',
  'stakingAPT',
  'creatorHandle',
] as const) {
  // 챌린지 이미지
  @ApiProperty({
    example: 'cover.png',
    description: '챌린지 이미지 파일',
  })
  image: Express.Multer.File;
}
