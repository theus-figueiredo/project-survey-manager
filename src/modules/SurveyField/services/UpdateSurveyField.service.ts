import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { SurveyFieldOptionResponse } from '../../SurveyFieldOption/responses/SurveyFieldOption.response';
import { UpdateSurveyFieldDto } from '../dto/UpdateSurveyField.dto';
import { SurveyField } from '../entities/SurveyField.entity';
import { SurveyFieldResponse } from '../responses/SurveyField.response';

/**
 * Service responsible for updating survey fields.
 */
@Injectable()
export class UpdateSurveyFieldService {
  /**
   * UpdateSurveyFieldService constructor.
   *
   * @param {Repository<SurveyField>} surveyFieldRepository - Repository used to query and persist survey fields.
   */
  public constructor(
    @InjectRepository(SurveyField)
    protected readonly surveyFieldRepository: Repository<SurveyField>,
  ) {}

  /**
   * Updates a survey field using only the fields received in the payload.
   *
   * @param {UpdateSurveyFieldDto} updateSurveyFieldDto - DTO containing survey field update data.
   * @returns {Promise<SurveyFieldResponse>} A promise that resolves to the updated survey field response.
   */
  public async update(
    updateSurveyFieldDto: UpdateSurveyFieldDto,
  ): Promise<SurveyFieldResponse> {
    const field = await this.getSurveyField(updateSurveyFieldDto.id);

    this.applyUpdates(field, updateSurveyFieldDto);

    const savedField = await this.surveyFieldRepository.save(field);

    return SurveyFieldResponse.fromSurveyField(
      savedField,
      (savedField.options ?? []).map((option) =>
        SurveyFieldOptionResponse.fromSurveyFieldOption(option),
      ),
    );
  }

  /**
   * Retrieves the survey field to update.
   *
   * @param {number} id - Survey field id.
   * @returns {Promise<SurveyField>} A promise that resolves to the survey field entity.
   */
  protected async getSurveyField(id: number): Promise<SurveyField> {
    const field = await this.surveyFieldRepository.findOne({
      where: { id },
      relations: {
        options: true,
      },
      order: {
        options: {
          order: 'ASC',
        },
      },
    });

    if (!field) {
      throw new NotFoundException(
        'Survey field not found',
        'Campo da survey não encontrado',
        { id },
      );
    }

    return field;
  }

  /**
   * Applies received update fields to a survey field entity.
   *
   * @param {SurveyField} field - Survey field entity to update.
   * @param {UpdateSurveyFieldDto} updateSurveyFieldDto - DTO containing update data.
   * @returns {void}
   */
  protected applyUpdates(
    field: SurveyField,
    updateSurveyFieldDto: UpdateSurveyFieldDto,
  ): void {
    Object.assign(
      field,
      Object.fromEntries(
        Object.entries(updateSurveyFieldDto).filter(
          ([key]: [string, unknown]) => key !== 'id',
        ),
      ),
    );
  }
}
