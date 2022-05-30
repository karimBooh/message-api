import {
  applyDecorators,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from '../../auth/dto/login.dto';
import { Public } from './public';
import { LoginPipe } from '../pipe/login.pipe';
import { LocalAuthGuard } from '../../auth/guard/local-auth.guard';

export function Login() {
  return applyDecorators(
    ApiBody({ type: LoginDto }),
    Public(),
    UseGuards(LocalAuthGuard),
  );
}
