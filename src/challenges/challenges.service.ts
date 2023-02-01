import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { DailyRecord } from './dailyRecords.entity';
import { Challenge } from './challenges.entity';
import * as path from 'path';
import { TotalRecord } from './totalRecords.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
    @InjectRepository(DailyRecord)
    private DailyRecordRepository: Repository<DailyRecord>,
    @InjectRepository(TotalRecord)
    private TotalRecordRepository: Repository<TotalRecord>,
    private readonly config: ConfigService,
  ) {}

  async getS3URL(key: string, prefix = null) {
    return prefix
      ? (await this.config.get('AWS_S3_CLOUDFRONT_ENDPOINT')) +
          '/' +
          prefix +
          '/' +
          key
      : (await this.config.get('AWS_S3_CLOUDFRONT_ENDPOINT')) + '/' + key;
  }

  // 챌린지 참여
  async joinChallenge(id, user: User) {
    const totalRecord = this.TotalRecordRepository.create({
      challengerId: user.id,
      challengeId: id,
    });
    await this.DailyRecordRepository.save(totalRecord);
    return totalRecord;
  }

  // challeng 인증
  async verifyChallenge(user: User, id, videoFile) {
    console.log('verifyChallenge >>>>>>');
    const videoKey = videoFile.key;
    console.log('videoKey >>>>>>', videoKey);
    const s3Url = await this.getS3URL(videoKey);
    console.log(s3Url);
    const ext = path.extname(videoKey); // 파일의 확장자 추출
    const basename = path.basename(videoKey, ext); // 파일 이름
    const m3u8Key = basename + '.m3u8';
    const streamingUrl = await this.getS3URL(
      m3u8Key,
      `lifemining/videos-convert/${basename}/Default/assets/HLS`,
    );
    const thumbnailKey = basename + '.0000000.jpg';
    const thumbnailUrl = await this.getS3URL(
      thumbnailKey,
      `lifemining/videos-convert/${basename}/Default/Thumbnails`,
    );
    const dailyRecord = this.DailyRecordRepository.create({
      challengerId: user.id,
      challengeId: id,
      s3Url: s3Url,
      streamingUrl: streamingUrl,
      thumbnailUrl: thumbnailUrl,
    });
    await this.DailyRecordRepository.save(dailyRecord);
    const totalRecord = await this.TotalRecordRepository.createQueryBuilder(
      'totalRecord',
    )
      .leftJoinAndSelect('totalRecord.challenge', 'challenge')
      .where({
        challengerId: user.id,
        challengeId: id,
      })
      .getOne();
    totalRecord.totalDays += 1;
    if (totalRecord.totalDays >= totalRecord.challenge.passDays) {
      totalRecord.claimable = true;
    }
    await this.TotalRecordRepository.save(totalRecord);
    return dailyRecord;
  }

  retrieveChallengeList() {
    return this.challengesRepository.find();
  }
}
