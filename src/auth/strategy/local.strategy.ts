import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[*@!#%&<>()^~{}]).{8,}$/.test(
        password,
      )
    ) {
      throw new BadRequestException(
        'The password need to contain at least 8 characters with special character and number with Uppercase and lowercase',
      );
    }
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
