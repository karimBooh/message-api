import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'iPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            typeof value === 'string' &&
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[*@!#%&()<>^~{}]).{8,}$/.test(
              value,
            )
          );
        },
      },
    });
  };
}
