import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    // Reset hours to compare only dates
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= now;
  }

  defaultMessage() {
    return 'The date must be today or a future date';
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}
