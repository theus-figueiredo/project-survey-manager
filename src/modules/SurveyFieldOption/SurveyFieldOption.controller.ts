import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { Authorize } from '../Auth/decorators/Authorization.decorator';
import { AuthGuard } from '../Auth/guards/Auth.guard';
import { AuthorizationGuard } from '../Auth/guards/Authorization.guard';
import { PositionsEnum } from '../User/enums/Positions.enum';
import { ApiUpdateSurveyFieldOptionDocs } from './docs/UpdateSurveyFieldOptionDocs';
import { UpdateSurveyFieldOptionDto } from './dto/UpdateSurveyFieldOption.dto';
import { SurveyFieldOptionResponse } from './responses/SurveyFieldOption.response';
import { UpdateSurveyFieldOptionService } from './services/UpdateSurveyFieldOption.service';

/**
 * Controller responsible for survey field option endpoints.
 */
@ApiTags('SurveyFieldOption')
@ApiBearerAuth('bearerAuth')
@Controller('/v1/survey-field-option')
export class SurveyFieldOptionController {
  /**
   * SurveyFieldOptionController constructor.
   *
   * @param {UpdateSurveyFieldOptionService} updateSurveyFieldOptionService - Service used to update survey field options.
   */
  public constructor(
    protected readonly updateSurveyFieldOptionService: UpdateSurveyFieldOptionService,
  ) {}

  /**
   * Updates a survey field option using only received fields.
   *
   * @param {UpdateSurveyFieldOptionDto} body - DTO containing survey field option update data.
   * @returns {Promise<ApiResponse<SurveyFieldOptionResponse>>} A promise that resolves to the updated survey field option response.
   */
  @ApiUpdateSurveyFieldOptionDocs()
  @Patch('/update')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Authorize({
    positions: [PositionsEnum.CONSULTANT],
  })
  public async update(
    @Body() body: UpdateSurveyFieldOptionDto,
  ): Promise<ApiResponse<SurveyFieldOptionResponse>> {
    const option = await this.updateSurveyFieldOptionService.update(body);

    return ApiResponse.success(
      option,
      'opção do campo da survey atualizada com sucesso',
    );
  }
}
