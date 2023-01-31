import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';

@Module({
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
