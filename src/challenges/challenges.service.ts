import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ChallengeHistory } from './challengeHistories.entity';
import { Challenge } from './challenges.entity';
import * as path from 'path';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
    @InjectRepository(ChallengeHistory)
    private challengeHistoriesRepository: Repository<ChallengeHistory>,
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
    const challengeHistory = this.challengeHistoriesRepository.create({
      challengerId: user.id,
      challengeId: id,
      s3Url: s3Url,
      streamingUrl: streamingUrl,
      thumbnailUrl: thumbnailUrl,
    });
    await this.challengeHistoriesRepository.save(challengeHistory);
    return challengeHistory;
  }

  retrieveChallengeList() {
    return this.challengesRepository.find();
  }
}
