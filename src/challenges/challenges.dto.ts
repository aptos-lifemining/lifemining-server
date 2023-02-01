import { ApiProperty } from '@nestjs/swagger';

export class VerifyChallengeDTO {
  @ApiProperty({
    example: 1,
    description: '챌린지 ID',
  })
  challengeId: number;
}
