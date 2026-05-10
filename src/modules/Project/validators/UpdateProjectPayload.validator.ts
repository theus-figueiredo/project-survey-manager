import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UpdateProjectDto } from '../dto/UpdateProject.dto';

const updatableProjectFields: Array<keyof UpdateProjectDto> = [
  'name',
  'description',
  'clientName',
  'projectLeaderId',
  'startDate',
  'phase',
  'totalPhases',
  'status',
  'completedAt',
];

/**
 * Validator responsible for ensuring that a project update payload contains at least one update field.
 */
@ValidatorConstraint({ name: 'UpdateProjectPayloadValidator', async: false })
export class UpdateProjectPayloadValidator implements ValidatorConstraintInterface {
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
    const payload = args.object as UpdateProjectDto;

    return updatableProjectFields.some((field: keyof UpdateProjectDto) =>
      Object.prototype.hasOwnProperty.call(payload, field),
    );
  }

  /**
   * Returns the default validation error message.
   *
   * @returns {string} The validation error message.
   */
  public defaultMessage(): string {
    return 'provide at least one project field to update';
  }
}

/**
 * Registers the update project payload validator in a DTO property.
 *
 * @param {ValidationOptions} validationOptions - Optional class-validator options.
 * @returns {PropertyDecorator} The property decorator.
 */
export function HasProjectUpdateFields(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: UpdateProjectPayloadValidator,
    });
  };
}
