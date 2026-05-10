import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '../../../common/errors/NotFound.exception';
import { UpdateSurveyFieldOptionDto } from '../dto/UpdateSurveyFieldOption.dto';
import { SurveyFieldOption } from '../entities/SurveyFieldOption.entity';
import { SurveyFieldOptionResponse } from '../responses/SurveyFieldOption.response';

/**
 * Service responsible for updating survey field options.
 */
@Injectable()
export class UpdateSurveyFieldOptionService {
  /**
   * UpdateSurveyFieldOptionService constructor.
   *
   * @param {Repository<SurveyFieldOption>} surveyFieldOptionRepository - Repository used to query and persist survey field options.
   */
  public constructor(
    @InjectRepository(SurveyFieldOption)
    protected readonly surveyFieldOptionRepository: Repository<SurveyFieldOption>,
  ) {}

  /**
   * Updates a survey field option using only the fields received in the payload.
   *
   * @param {UpdateSurveyFieldOptionDto} updateSurveyFieldOptionDto - DTO containing survey field option update data.
   * @returns {Promise<SurveyFieldOptionResponse>} A promise that resolves to the updated survey field option response.
   */
  public async update(
    updateSurveyFieldOptionDto: UpdateSurveyFieldOptionDto,
  ): Promise<SurveyFieldOptionResponse> {
    const option = await this.getSurveyFieldOption(
      updateSurveyFieldOptionDto.id,
    );

    this.applyUpdates(option, updateSurveyFieldOptionDto);

    const savedOption = await this.surveyFieldOptionRepository.save(option);

    return SurveyFieldOptionResponse.fromSurveyFieldOption(savedOption);
  }

  /**
   * Retrieves the survey field option to update.
   *
   * @param {number} id - Survey field option id.
   * @returns {Promise<SurveyFieldOption>} A promise that resolves to the survey field option entity.
   */
  protected async getSurveyFieldOption(id: number): Promise<SurveyFieldOption> {
    const option = await this.surveyFieldOptionRepository.findOne({
      where: { id },
    });

    if (!option) {
      throw new NotFoundException(
        'Survey field option not found',
        'Opção do campo da survey não encontrada',
        { id },
      );
    }

    return option;
  }

  /**
   * Applies received update fields to a survey field option entity.
   *
   * @param {SurveyFieldOption} option - Survey field option entity to update.
   * @param {UpdateSurveyFieldOptionDto} updateSurveyFieldOptionDto - DTO containing update data.
   * @returns {void}
   */
  protected applyUpdates(
    option: SurveyFieldOption,
    updateSurveyFieldOptionDto: UpdateSurveyFieldOptionDto,
  ): void {
    Object.assign(
      option,
      Object.fromEntries(
        Object.entries(updateSurveyFieldOptionDto).filter(
          ([key]: [string, unknown]) => key !== 'id',
        ),
      ),
    );
  }
}
