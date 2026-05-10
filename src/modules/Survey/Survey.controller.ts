import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { BaseController } from '../../common/controllers/Base.controller';
import { ApiResponse } from '../../common/responses/ApiResponse';
import type { AuthenticatedRequest } from '../../common/types/AuthenticatedRequest.type';
import { Authorize } from '../Auth/decorators/Authorization.decorator';
import { AuthGuard } from '../Auth/guards/Auth.guard';
import { AuthorizationGuard } from '../Auth/guards/Authorization.guard';
import { PositionsEnum } from '../User/enums/Positions.enum';
import { ApiCreateSurveyDocs } from './docs/CreateSurveyDocs';
import { ApiGetSurveyDocs } from './docs/GetSurveyDocs';
import { ApiListSurveyDocs } from './docs/ListSurveyDocs';
import { ApiUpdateSurveyDocs } from './docs/UpdateSurveyDocs';
import { CreateSurveyDto } from './dto/CreateSurvey.dto';
import { GetSurvetDto } from './dto/GetSurvet.dto';
import { ListSurveyDto } from './dto/ListSurvey.dto';
import { UpdateSurveyDto } from './dto/UpdateSurvey.dto';
import { ListSurveyResponse } from './responses/ListSurvey.response';
import { SurveyResponse } from './responses/Survey.response';
import { CreateSurveyService } from './services/CreateSurvey.service';
import { GetSurveyService } from './services/GetSurvey.service';
import { ListSurveyService } from './services/ListSurvey.service';
import { UpdateSurveyService } from './services/UpdateSurvey.service';

/**
 * Controller responsible for survey endpoints.
 */
@ApiTags('Survey')
@ApiBearerAuth('bearerAuth')
@Controller('/v1/survey')
export class SurveyController extends BaseController {
  /**
   * SurveyController constructor.
   *
   * @param {CreateSurveyService} createSurveyService - Service used to create surveys.
   * @param {GetSurveyService} getSurveyService - Service used to retrieve surveys.
   * @param {ListSurveyService} listSurveyService - Service used to list surveys.
   * @param {UpdateSurveyService} updateSurveyService - Service used to update surveys.
   */
  public constructor(
    protected readonly createSurveyService: CreateSurveyService,
    protected readonly getSurveyService: GetSurveyService,
    protected readonly listSurveyService: ListSurveyService,
    protected readonly updateSurveyService: UpdateSurveyService,
  ) {
    super();
  }

  /**
   * Creates a survey with fields and options.
   *
   * @param {CreateSurveyDto} body - DTO containing survey, field, and option data.
   * @param {AuthenticatedRequest} request - Authenticated HTTP request.
   * @returns {Promise<ApiResponse<SurveyResponse>>} A promise that resolves to the created survey response.
   */
  @ApiCreateSurveyDocs()
  @Post('/create')
  @UseGuards(AuthGuard)
  @Authorize({
      positions: [PositionsEnum.CONSULTANT]
  })
  public async create(@Body() body: CreateSurveyDto,@Req() request: AuthenticatedRequest): Promise<ApiResponse<SurveyResponse>> {
    const survey = await this.createSurveyService.create(
      body,
      this.getAuthenticatedUser(request),
    );

    return ApiResponse.success(survey, 'sucesso');
  }

  /**
   * Retrieves a survey.
   *
   * @param {GetSurvetDto} query - Query parameters containing the survey lookup data.
   * @returns {Promise<ApiResponse<SurveyResponse>>} A promise that resolves to the found survey response.
   */
  @ApiGetSurveyDocs()
  @Get('/get')
  @UseGuards(AuthGuard)
  public async getById(@Query() query: GetSurvetDto): Promise<ApiResponse<SurveyResponse>> {
    const survey = await this.getSurveyService.get(query);

    return ApiResponse.success(survey, 'sucesso');
  }

  /**
   * Lists surveys filtered by default flag or project id.
   *
   * @param {ListSurveyDto} query - Query parameters containing exactly one list filter.
   * @returns {Promise<ApiResponse<ListSurveyResponse[]>>} A promise that resolves to the survey list response.
   */
  @ApiListSurveyDocs()
  @Get('/list')
  @UseGuards(AuthGuard)
  public async list(
    @Query() query: ListSurveyDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<ListSurveyResponse[]> | void> {
    const surveys = await this.listSurveyService.list(query);

    if (surveys.length === 0) {
      response.status(HttpStatus.NO_CONTENT);
      return;
    }

    return ApiResponse.success(surveys, 'sucesso');
  }

  /**
   * Updates a survey using only received fields.
   *
   * @param {UpdateSurveyDto} body - DTO containing survey update data.
   * @returns {Promise<ApiResponse<SurveyResponse>>} A promise that resolves to the updated survey response.
   */
  @ApiUpdateSurveyDocs()
  @Patch('/update')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Authorize({
      positions: [PositionsEnum.CONSULTANT]
  })
  public async update(@Body() body: UpdateSurveyDto): Promise<ApiResponse<SurveyResponse>> {
    const survey = await this.updateSurveyService.update(body);

    return ApiResponse.success(survey, 'survey atualizada com sucesso');
  }
}
