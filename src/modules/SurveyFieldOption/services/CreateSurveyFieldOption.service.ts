import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateSurveyFieldOptionDto } from '../dto/CreateSurveyFieldOption.dto';
import { SurveyFieldOption } from '../entities/SurveyFieldOption.entity';
import { SurveyField } from '../../SurveyField/entities/SurveyField.entity';
import { SurveyFieldOptionResponse } from '../responses/SurveyFieldOption.response';

/**
 * Service responsible for creating survey field options.
 */
@Injectable()
export class CreateSurveyFieldOptionService {
  /**
   * Creates survey field options for a survey field.
   *
   * @param {SurveyField} field - The survey field that owns the options.
   * @param {CreateSurveyFieldOptionDto[]} optionsDto - DTOs containing option data.
   * @param {EntityManager} manager - Transactional entity manager.
   * @returns {Promise<SurveyFieldOptionResponse[]>} A promise that resolves to the created option responses.
   */
  public async createMany(
    field: SurveyField,
    optionsDto: CreateSurveyFieldOptionDto[],
    manager: EntityManager,
  ): Promise<SurveyFieldOptionResponse[]> {
    const optionRepository = manager.getRepository(SurveyFieldOption);

    const options = optionsDto.map((optionDto: CreateSurveyFieldOptionDto) =>
      optionRepository.create({
        field,
        value: optionDto.value,
        order: optionDto.order,
      }),
    );

    const savedOptions = await optionRepository.save(options);

    return savedOptions.map((option: SurveyFieldOption) =>
      SurveyFieldOptionResponse.fromSurveyFieldOption(option),
    );
  }
}
