import {
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService,
  ) {
    super();
  }

  validate(request) {
    const address = request.header('address');

    if (!address) {
      throw new UnauthorizedException();
    }

    // Retrieve user from database using the extracted username
    const user = this.userService.findOneByAddress(address);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = await this.validate(request);
    return await request.user;
  }
}
