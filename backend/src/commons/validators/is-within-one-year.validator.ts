import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsWithinOneYearConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args?: ValidationArguments) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    // compare only dates
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const max = new Date(now);
    max.setFullYear(max.getFullYear() + 1);

    return date <= max;
  }

  defaultMessage() {
    return 'The date must be at most one year from today';
  }
}

export function IsWithinOneYear(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWithinOneYearConstraint,
    });
  };
}
