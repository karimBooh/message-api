import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _userService: UserService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<User> {
    const usr = await this._userService.findByLogin(identifier, pass);
    return usr;
  }

  async validateJwt(user: User) {
    return await this._userService.findByIdAndLastDisco(user);
  }

  login(user: Omit<User, 'password'>) {
    const payload = { user, sub: user.id };
    return {
      access_token: this._jwtService.sign(payload),
    };
  }

  async disconnect(user: User): Promise<User> {
    return await this._userService.updateLastDisconnect(user);
  }
}
