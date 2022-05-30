import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Public } from '../utils/decorator/public';
import { Request } from 'express';
import { Login } from '../utils/decorator/login.decorator';
import { signupDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
  ) {}

  @Put('logout')
  async logout(@Req() req: Request) {
    return this._authService.disconnect(req.user as User);
  }

  @Login()
  @Post('login')
  async login(@Req() req: Request): Promise<{ access_token: string }> {
    return this._authService.login(req.user as User);
  }

  @Public()
  @Post('signup')
  async signup(
    @Req() req: Request,
    @Body(new ValidationPipe()) user: signupDto,
  ): Promise<User> {
    if (!user.email && !user.phone) {
      throw new BadRequestException('Add an email or a phone number');
    }
    return this._userService.create(user);
  }
}
