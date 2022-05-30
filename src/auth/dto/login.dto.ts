import { IsPassword } from '../../utils/decorator/is-password';

export class LoginDto {
  identifier: string;

  @IsPassword({
    message:
      'The password need to contain at least 8 characters with special character and number with Uppercase and lowercase',
  })
  password: string;
}
