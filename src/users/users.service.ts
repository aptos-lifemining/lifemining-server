import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByAddress(address: string) {
    console.log('>>>>>>> in findOneByAddress() of UsersService <<<<<<<');
    const user = await this.usersRepository.findOneBy({ address });
    console.log('user', user);
    return user;
  }
}
