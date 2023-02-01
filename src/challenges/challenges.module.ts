import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeHistory } from './challengeHistories.entity';
import { Challenge } from './challenges.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Challenge, ChallengeHistory]),
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
