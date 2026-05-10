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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { BaseController } from '../../common/controllers/Base.controller';
import { ApiResponse } from '../../common/responses/ApiResponse';
import type { AuthenticatedRequest } from '../../common/types/AuthenticatedRequest.type';
import { Positions } from '../Auth/decorators/Authorization.decorator';
import { AuthGuard } from '../Auth/guards/Auth.guard';
import { AuthorizationGuard } from '../Auth/guards/Authorization.guard';
import { PositionsEnum } from '../User/enums/Positions.enum';
import { ApiAddUsersToProjectDocs } from './docs/AddUsersToProjectDocs';
import { ApiCreateProjectDocs } from './docs/CreateProjectDocs';
import { ApiGetProjectDocs } from './docs/GetProjectDocs';
import { ApiListProjectDocs } from './docs/ListProjectDocs';
import { ApiUpdateProjectDocs } from './docs/UpdateProjectDocs';
import { AddUsersToProjectDto } from './dto/AddUsersToProject.dto';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { GetProjectByIdDto } from './dto/GetProjectById.dto';
import { ListProjectDto } from './dto/ListProject.dto';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import { ListProjectResponse } from './responses/ListProject.response';
import { ProjectResponse } from './responses/Project.response';
import { ProjectWithUsersResponse } from './responses/ProjectWithUsers.response';
import { AddNewProjectService } from './services/AddNewProject.service';
import { AddUsersToProjectService } from './services/AddUsersToProject.service';
import { GetProjectService } from './services/GetProject.service';
import { ListProjectService } from './services/ListProject.service';
import { UpdateProjectService } from './services/UpdateProject.service';

/**
 * Controller responsible for project endpoints.
 */
@ApiTags('Project')
@ApiBearerAuth('bearerAuth')
@Controller('/v1/project')
export class ProjectController extends BaseController {
  /**
   * ProjectController constructor.
   *
   * @param {AddNewProjectService} addNewProjectService - Service used to create projects and duplicate default surveys.
   * @param {GetProjectService} getProjectService - Service used to retrieve projects.
   * @param {ListProjectService} listProjectService - Service used to list projects.
   * @param {UpdateProjectService} updateProjectService - Service used to update projects.
   * @param {AddUsersToProjectService} addUsersToProjectService - Service used to add users to projects.
   */
  public constructor(
    protected readonly addNewProjectService: AddNewProjectService,
    protected readonly getProjectService: GetProjectService,
    protected readonly listProjectService: ListProjectService,
    protected readonly updateProjectService: UpdateProjectService,
    protected readonly addUsersToProjectService: AddUsersToProjectService,
  ) {
    super();
  }

  /**
   * Creates a project and duplicates default surveys into it.
   *
   * @param {CreateProjectDto} body - DTO containing project creation data.
   * @param {AuthenticatedRequest} request - Authenticated HTTP request.
   * @returns {Promise<ApiResponse<ProjectResponse>>} A promise that resolves to the created project response.
   */
  @ApiCreateProjectDocs()
  @Post('/create')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Positions(PositionsEnum.CONSULTANT)
  public async create(@Body() body: CreateProjectDto, @Req() request: AuthenticatedRequest): Promise<ApiResponse<ProjectResponse>> {
    const project = await this.addNewProjectService.add(
      body,
      this.getAuthenticatedUser(request),
    );

    return ApiResponse.success(project, 'sucesso');
  }

  /**
   * Retrieves a project by id.
   *
   * @param {GetProjectByIdDto} query - Query parameters containing the project id.
   * @returns {Promise<ApiResponse<ProjectResponse>>} A promise that resolves to the found project response.
   */
  @ApiGetProjectDocs()
  @Get('/get')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Positions(PositionsEnum.CONSULTANT)
  public async getById(@Query() query: GetProjectByIdDto): Promise<ApiResponse<ProjectResponse>> {
      const project = await this.getProjectService.get(query.id);

      return ApiResponse.success(project, 'sucesso');
  }

  /**
   * Lists projects using filters and pagination.
   *
   * @param {ListProjectDto} query - Query parameters containing filters and pagination values.
   * @param {Response} response - HTTP response used to set no-content status.
   * @returns {Promise<ApiResponse<ListProjectResponse> | void>} A promise that resolves to the paginated project list response.
   */
  @ApiListProjectDocs()
  @Get('/list')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Positions(PositionsEnum.CONSULTANT)
  public async list(
    @Query() query: ListProjectDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<ListProjectResponse> | void> {
    const projects = await this.listProjectService.list(query);

    if (projects.items.length === 0) {
      response.status(HttpStatus.NO_CONTENT);
      return;
    }

    return ApiResponse.success(projects, 'sucesso');
  }

  /**
   * Updates a project using only received fields.
   *
   * @param {UpdateProjectDto} body - DTO containing project update data.
   * @returns {Promise<ApiResponse<ProjectResponse>>} A promise that resolves to the updated project response.
   */
  @ApiUpdateProjectDocs()
  @Patch('/update')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Positions(PositionsEnum.CONSULTANT)
  public async update(
    @Body() body: UpdateProjectDto,
  ): Promise<ApiResponse<ProjectResponse>> {
    const project = await this.updateProjectService.update(body);

    return ApiResponse.success(project, 'sucesso');
  }

  /**
   * Adds users to a project.
   *
   * @param {AddUsersToProjectDto} body - DTO containing project and user ids.
   * @returns {Promise<ApiResponse<ProjectWithUsersResponse>>} A promise that resolves to the project with associated users.
   */
  @ApiAddUsersToProjectDocs()
  @Post('/add-users')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Positions(PositionsEnum.CONSULTANT)
  public async addUsers(
    @Body() body: AddUsersToProjectDto,
  ): Promise<ApiResponse<ProjectWithUsersResponse>> {
    const project = await this.addUsersToProjectService.add(body);

    return ApiResponse.success(
      project,
      'sucesso',
    );
  }
}
