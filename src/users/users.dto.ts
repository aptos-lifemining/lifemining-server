import { PickType } from '@nestjs/swagger';
import { User } from './users.entity';

export class CreateUserDTO extends PickType(User, [
  'handle',
  'address',
  'description',
] as const) {}
