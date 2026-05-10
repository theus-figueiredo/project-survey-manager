import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { Authorize } from '../Auth/decorators/Authorization.decorator';
import { AuthGuard } from '../Auth/guards/Auth.guard';
import { AuthorizationGuard } from '../Auth/guards/Authorization.guard';
import { PositionsEnum } from '../User/enums/Positions.enum';
import { ApiUpdateSurveyFieldDocs } from './docs/UpdateSurveyFieldDocs';
import { UpdateSurveyFieldDto } from './dto/UpdateSurveyField.dto';
import { SurveyFieldResponse } from './responses/SurveyField.response';
import { UpdateSurveyFieldService } from './services/UpdateSurveyField.service';

/**
 * Controller responsible for survey field endpoints.
 */
@ApiTags('SurveyField')
@ApiBearerAuth('bearerAuth')
@Controller('/v1/survey-field')
export class SurveyFieldController {
  /**
   * SurveyFieldController constructor.
   *
   * @param {UpdateSurveyFieldService} updateSurveyFieldService - Service used to update survey fields.
   */
  public constructor(
    protected readonly updateSurveyFieldService: UpdateSurveyFieldService,
  ) {}

  /**
   * Updates a survey field using only received fields.
   *
   * @param {UpdateSurveyFieldDto} body - DTO containing survey field update data.
   * @returns {Promise<ApiResponse<SurveyFieldResponse>>} A promise that resolves to the updated survey field response.
   */
  @ApiUpdateSurveyFieldDocs()
  @Patch('/update')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Authorize({
    positions: [PositionsEnum.CONSULTANT],
  })
  public async update(
    @Body() body: UpdateSurveyFieldDto,
  ): Promise<ApiResponse<SurveyFieldResponse>> {
    const field = await this.updateSurveyFieldService.update(body);

    return ApiResponse.success(field, 'campo da survey atualizado com sucesso');
  }
}
