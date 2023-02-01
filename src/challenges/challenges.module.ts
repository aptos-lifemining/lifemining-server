import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyRecord } from './dailyRecords.entity';
import { Challenge } from './challenges.entity';
import { TotalRecord } from './totalRecords.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Challenge, DailyRecord, TotalRecord]),
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
