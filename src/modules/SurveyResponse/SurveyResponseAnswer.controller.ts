import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { AuthGuard } from '../Auth/guards/Auth.guard';
import { ApiCreateSurveyResponseAnswerDocs } from './docs/CreateSurveyResponseAnswerDocs';
import { ApiCreateSurveyResponseAnswersBulkDocs } from './docs/CreateSurveyResponseAnswersBulkDocs';
import { CreateSurveyResponseAnswerDto } from './dto/CreateSurveyResponseAnswer.dto';
import { CreateSurveyResponseAnswersBulkDto } from './dto/CreateSurveyResponseAnswersBulk.dto';
import { CreateSurveyResponseAnswersResponse } from './responses/CreateSurveyResponseAnswers.response';
import { CreateSurveyResponseAnswerService } from './services/CreateSurveyResponseAnswer.service';
import { CreateSurveyResponseAnswersBulkService } from './services/CreateSurveyResponseAnswersBulk.service';

/**
 * Controller responsible for survey response answer endpoints.
 */
@ApiTags('SurveyResponseAnswer')
@ApiBearerAuth('bearerAuth')
@Controller('/v1/survey-response-answer')
export class SurveyResponseAnswerController {
  /**
   * SurveyResponseAnswerController constructor.
   *
   * @param {CreateSurveyResponseAnswerService} createSurveyResponseAnswerService - Service used to create a field answer.
   * @param {CreateSurveyResponseAnswersBulkService} createSurveyResponseAnswersBulkService - Service used to create field answers in bulk.
   */
  public constructor(
    protected readonly createSurveyResponseAnswerService: CreateSurveyResponseAnswerService,
    protected readonly createSurveyResponseAnswersBulkService: CreateSurveyResponseAnswersBulkService,
  ) {}

  /**
   * Creates answers for a single survey field.
   *
   * @param {CreateSurveyResponseAnswerDto} body - DTO containing answer creation data.
   * @returns {Promise<ApiResponse<CreateSurveyResponseAnswersResponse>>} A promise that resolves to the created answers.
   */
  @ApiCreateSurveyResponseAnswerDocs()
  @Post('/create')
  @UseGuards(AuthGuard)
  public async create(@Body() body: CreateSurveyResponseAnswerDto): Promise<ApiResponse<CreateSurveyResponseAnswersResponse>> {
    const answers = await this.createSurveyResponseAnswerService.create(body);

    return ApiResponse.success(
      answers,
      'sucesso',
    );
  }

  /**
   * Creates answers for multiple survey fields.
   *
   * @param {CreateSurveyResponseAnswersBulkDto} body - DTO containing bulk answer creation data.
   * @returns {Promise<ApiResponse<CreateSurveyResponseAnswersResponse>>} A promise that resolves to the created answers.
   */
  @ApiCreateSurveyResponseAnswersBulkDocs()
  @Post('/create-bulk')
  @UseGuards(AuthGuard)
  public async createBulk(@Body() body: CreateSurveyResponseAnswersBulkDto): Promise<ApiResponse<CreateSurveyResponseAnswersResponse>> {
    const answers = await this.createSurveyResponseAnswersBulkService.create(
      body,
    );

    return ApiResponse.success(
      answers,
      'sucesso',
    );
  }
}
