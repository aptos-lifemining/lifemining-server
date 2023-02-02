import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './users.dto';
import { User } from './users.entity';
import { ConfigService } from '@nestjs/config';
import { Challenge } from 'src/challenges/challenges.entity';
import { DailyRecord } from 'src/challenges/dailyRecords.entity';
import { TotalRecord } from 'src/challenges/totalRecords.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(DailyRecord)
    private dailyRecordRepository: Repository<DailyRecord>,

    @InjectRepository(TotalRecord)
    private totalRecordRepository: Repository<TotalRecord>,

    private configService: ConfigService,
  ) {}

  getS3Url(profileImage) {
    return (
      this.configService.get('AWS_S3_CLOUDFRONT_ENDPOINT') +
      '/' +
      profileImage.key
    );
  }

  async findOneByAddress(address: string) {
    console.log('>>>>>>> in findOneByAddress() of UsersService <<<<<<<');
    const user = await this.usersRepository.findOneBy({ address });
    console.log('user', user);
    return user;
  }

  async register(createUserDTO: CreateUserDTO, profileImage) {
    console.log('>>>>>>> in signup() of UsersService <<<<<<<');
    const user = await this.usersRepository.create({
      ...createUserDTO,
      profileImageUrl: this.getS3Url(profileImage),
    });
    await this.usersRepository.save(user);
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  upgrade(user: User) {
    user.roomImageUrl =
      'https://dev-static-files.uzumeta.com/lifemining/room-images/room-updated.png';
    return this.usersRepository.save(user);
  }

  downgrade(user: User) {
    user.roomImageUrl =
      'https://dev-static-files.uzumeta.com/lifemining/room-images/room-empty.png';
    return this.usersRepository.save(user);
  }

  async reset(handle: string) {
    const user = await this.usersRepository.findOneBy({ handle });
    const totalRecords = await this.totalRecordRepository.find({
      where: { challengerId: user.id },
    });
    // delete totalRecords
    await this.totalRecordRepository.remove(totalRecords);
    // delete dailyRecords
    const dailyRecords = await this.dailyRecordRepository.find({
      where: { challengerId: user.id },
    });
    await this.dailyRecordRepository.remove(dailyRecords);
    const totalRecordNew = {
      challengerId: user.id,
      challengeId: 1,
      participationDays: 2,
    };
    const totalRecord = await this.totalRecordRepository.create(totalRecordNew);
    await this.totalRecordRepository.save(totalRecord);

    const dailyRecordNew = {
      challengerId: user.id,
      challengeId: 1,
      thumbnailUrl:
        'https://dev-static-files.uzumeta.com/lifemining/videos-convert/lifemining-test_1675371751106/Default/Thumbnails/lifemining-test_1675371751106.0000000.jpg',
      s3Url:
        'https://dev-static-files.uzumeta.com/lifemining/videos/lifemining-test_1675371751106.mp4',
      streamingUrl:
        'https://dev-static-files.uzumeta.com/lifemining/videos-convert/lifemining-test_1675371751106/Default/Manifest.mpd',
    };
    const dailyRecord = await this.dailyRecordRepository.create(dailyRecordNew);
    await this.dailyRecordRepository.save(dailyRecord);
    const dailyRecord2 = await this.dailyRecordRepository.create(
      dailyRecordNew,
    );
    await this.dailyRecordRepository.save(dailyRecord2);
  }
}
