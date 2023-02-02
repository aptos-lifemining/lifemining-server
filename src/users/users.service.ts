import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './users.dto';
import { User } from './users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  getS3URL(profileImage) {
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
      profileImageUrl: this.getS3URL(profileImage),
    });
    await this.usersRepository.save(user);
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }
}
