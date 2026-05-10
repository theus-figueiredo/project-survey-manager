import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/controllers/Base.controller';
import { ApiResponse } from '../../common/responses/ApiResponse';
import type { AuthenticatedRequest } from '../../common/types/AuthenticatedRequest.type';
import { AuthGuard } from '../Auth/guards/Auth.guard';
import { ApiCreateSurveyResponseDocs } from './docs/CreateSurveyResponseDocs';
import { CreateSurveyResponseDto } from './dto/CreateSurveyResponse.dto';
import { SurveyResponseResponse } from './responses/SurveyResponse.response';
import { CreateSurveyResponseService } from './services/CreateSurveyResponse.service';

/**
 * Controller responsible for survey response endpoints.
 */
@ApiTags('SurveyResponse')
@ApiBearerAuth('bearerAuth')
@Controller('/v1/survey-response')
export class SurveyResponseController extends BaseController {
  /**
   * SurveyResponseController constructor.
   *
   * @param {CreateSurveyResponseService} createSurveyResponseService - Service used to create survey responses.
   */
  public constructor(
    protected readonly createSurveyResponseService: CreateSurveyResponseService,
  ) {
    super();
  }

  /**
   * Creates the main survey response record without answers.
   *
   * @param {CreateSurveyResponseDto} body - DTO containing survey response creation data.
   * @param {AuthenticatedRequest} request - Authenticated HTTP request.
   * @returns {Promise<ApiResponse<SurveyResponseResponse>>} A promise that resolves to the created survey response.
   */
  @ApiCreateSurveyResponseDocs()
  @Post('/create')
  @UseGuards(AuthGuard)
  public async create(@Body() body: CreateSurveyResponseDto, @Req() request: AuthenticatedRequest): Promise<ApiResponse<SurveyResponseResponse>> {
    const surveyResponse = await this.createSurveyResponseService.create(
      body,
      this.getAuthenticatedUser(request),
    );

    return ApiResponse.success(
      surveyResponse,
      'sucesso',
    );
  }
}
