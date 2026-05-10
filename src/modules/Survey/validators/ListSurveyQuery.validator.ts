import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ListSurveyDto } from '../dto/ListSurvey.dto';

/**
 * Validator responsible for checking list survey query filter combinations.
 */
@ValidatorConstraint({ name: 'ListSurveyQueryValidator', async: false })
export class ListSurveyQueryValidator implements ValidatorConstraintInterface {
  /**
   * Validates that the received filters represent a supported list query.
   *
   * @param {unknown} _value - Unused decorated property value.
   * @param {ValidationArguments} args - Validation arguments containing the DTO object.
   * @returns {boolean} Whether the query filter combination is valid.
   */
  public validate(
    _value: unknown,
    args: ValidationArguments,
  ): boolean {
    const query = args.object as ListSurveyDto;
    const hasDefault = query.default !== undefined;
    const hasProjectId = query.projectId !== undefined;

    switch (true) {
      case !hasDefault && !hasProjectId:
        return false;
      case query.default === true && hasProjectId:
        return false;
      case query.default === false && !hasProjectId:
        return false;
      default:
        return true;
    }
  }

  /**
   * Returns the default validation error message.
   *
   * @returns {string} The validation error message.
   */
  public defaultMessage(): string {
    return 'provide default=true, projectId, or default=false with projectId';
  }
}

/**
 * Registers the list survey query validator in a DTO property.
 *
 * @param {ValidationOptions} validationOptions - Optional class-validator options.
 * @returns {PropertyDecorator} The property decorator.
 */
export function IsValidListSurveyQuery(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: ListSurveyQueryValidator,
    });
  };
}
