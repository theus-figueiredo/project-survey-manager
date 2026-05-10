import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ClientException } from '../../../common/errors/Client.exception';
import { CreateSurveyFieldOptionService } from '../../SurveyFieldOption/services/CreateSurveyFieldOption.service';
import { Survey } from '../../Survey/entities/Survey.entity';
import { SurveyFieldOptionResponse } from '../../SurveyFieldOption/responses/SurveyFieldOption.response';
import { CreateSurveyFieldDto } from '../dto/CreateSurveyField.dto';
import { SurveyField } from '../entities/SurveyField.entity';
import { SurveyFieldTypesEnum } from '../enums/SurveyFieldTypes.enum';
import { SurveyFieldResponse } from '../responses/SurveyField.response';

const fieldsThatAllowOptions: SurveyFieldTypesEnum[] = [
  SurveyFieldTypesEnum.SELECT,
  SurveyFieldTypesEnum.CHECKBOX,
  SurveyFieldTypesEnum.RADIO,
];

/**
 * Service responsible for creating survey fields and their allowed options.
 */
@Injectable()
export class CreateSurveyFieldService {
  /**
   * CreateSurveyFieldService constructor.
   *
   * @param {CreateSurveyFieldOptionService} createSurveyFieldOptionService - Service used to create field options.
   */
  public constructor(
    protected readonly createSurveyFieldOptionService: CreateSurveyFieldOptionService,
  ) {}

  /**
   * Creates survey fields for a survey.
   *
   * @param {Survey} survey - The survey that owns the fields.
   * @param {CreateSurveyFieldDto[]} fieldsDto - DTOs containing field data.
   * @param {EntityManager} manager - Transactional entity manager.
   * @returns {Promise<SurveyFieldResponse[]>} A promise that resolves to the created field responses.
   * @throws {ClientException} Throws when options are invalid for the field type.
   */
  public async createMany(
    survey: Survey,
    fieldsDto: CreateSurveyFieldDto[],
    manager: EntityManager,
  ): Promise<SurveyFieldResponse[]> {
    const fieldRepository = manager.getRepository(SurveyField);
    const fields: SurveyFieldResponse[] = [];

    for (const fieldDto of fieldsDto) {
      this.validateOptions(fieldDto);

      const field = fieldRepository.create({
        survey,
        type: fieldDto.type,
        label: fieldDto.label,
        placeholder: fieldDto.placeholder ?? null,
        required: fieldDto.required ?? false,
        order: fieldDto.order,
      });

      const savedField = await fieldRepository.save(field);
      const optionsDto = fieldDto.options ?? [];

      const options: SurveyFieldOptionResponse[] = this.fieldCanHaveOptions(
        fieldDto.type,
      )
        ? await this.createSurveyFieldOptionService.createMany(
            savedField,
            optionsDto,
            manager,
          )
        : [];

      fields.push(SurveyFieldResponse.fromSurveyField(savedField, options));
    }

    return fields;
  }

  /**
   * Validates whether the received options are compatible with a survey field type.
   *
   * @param {CreateSurveyFieldDto} fieldDto - DTO containing field data and options.
   * @throws {ClientException} Throws when options are missing or forbidden for the field type.
   */
  private validateOptions(fieldDto: CreateSurveyFieldDto): void {
    const options = fieldDto.options ?? [];

    if (this.fieldCanHaveOptions(fieldDto.type) && options.length === 0) {
      throw new ClientException(
        'Survey field options are required for this field type',
        'Opções são obrigatórias para este tipo de campo',
        { type: fieldDto.type, label: fieldDto.label },
      );
    }

    if (!this.fieldCanHaveOptions(fieldDto.type) && options.length > 0) {
      throw new ClientException(
        'Survey field options are not allowed for this field type',
        'Opções não são permitidas para este tipo de campo',
        { type: fieldDto.type, label: fieldDto.label },
      );
    }
  }

  /**
   * Checks whether the survey field type allows options.
   *
   * @param {SurveyFieldTypesEnum} type - The survey field type.
   * @returns {boolean} True when the field type supports options.
   */
  private fieldCanHaveOptions(type: SurveyFieldTypesEnum): boolean {
    return fieldsThatAllowOptions.includes(type);
  }
}
