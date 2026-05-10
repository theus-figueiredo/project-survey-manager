import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UpdateSurveyDto } from '../dto/UpdateSurvey.dto';

const updatableSurveyFields: Array<keyof UpdateSurveyDto> = [
  'title',
  'default',
  'projectId',
];

/**
 * Validator responsible for ensuring that a survey update payload contains at least one update field.
 */
@ValidatorConstraint({ name: 'UpdateSurveyPayloadValidator', async: false })
export class UpdateSurveyPayloadValidator implements ValidatorConstraintInterface {
  /**
   * Validates that the payload contains at least one updatable field besides id.
   *
   * @param {unknown} _value - Unused decorated property value.
   * @param {ValidationArguments} args - Validation arguments containing the DTO object.
   * @returns {boolean} Whether the update payload has at least one updatable field.
   */
  public validate(
    _value: unknown,
    args: ValidationArguments,
  ): boolean {
    const payload = args.object as UpdateSurveyDto;

    return updatableSurveyFields.some((field: keyof UpdateSurveyDto) =>
      Object.prototype.hasOwnProperty.call(payload, field),
    );
  }

  /**
   * Returns the default validation error message.
   *
   * @returns {string} The validation error message.
   */
  public defaultMessage(): string {
    return 'provide at least one survey field to update';
  }
}

/**
 * Registers the update survey payload validator in a DTO property.
 *
 * @param {ValidationOptions} validationOptions - Optional class-validator options.
 * @returns {PropertyDecorator} The property decorator.
 */
export function HasSurveyUpdateFields(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: UpdateSurveyPayloadValidator,
    });
  };
}
