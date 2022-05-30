import { IsPassword } from '../../utils/decorator/is-password';
import { IsEmail, IsOptional, IsPhoneNumber } from "class-validator";

export class signupDto {
  name: string;
  @IsPassword({
    message:
      'The password need to contain at least 8 characters with special character and number with Uppercase and lowercase',
  })
  password: string;

  @IsOptional()
  @IsPhoneNumber('FR')
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
