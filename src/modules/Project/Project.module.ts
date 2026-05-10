import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/Auth.module';
import { SurveyModule } from '../Survey/Survey.module';
import { User } from '../User/entities/User.entity';
import { UserModule } from '../User/User.module';
import { ProjectController } from './Project.controller';
import { Project } from './entities/Project.entity';
import { AddNewProjectService } from './services/AddNewProject.service';
import { AddUsersToProjectService } from './services/AddUsersToProject.service';
import { CreateProjectService } from './services/CreateProject.service';
import { DuplicateGlobalSurveyToProjectService } from './services/DuplicateGblobalSurveyToProject.service';
import { GetProjectService } from './services/GetProject.service';
import { ListProjectService } from './services/ListProject.service';
import { UpdateProjectService } from './services/UpdateProject.service';

/**
 * Module responsible for registering the Project entity in the Nest container.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User]),
    AuthModule,
    SurveyModule,
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [
    AddNewProjectService,
    AddUsersToProjectService,
    CreateProjectService,
    DuplicateGlobalSurveyToProjectService,
    GetProjectService,
    ListProjectService,
    UpdateProjectService,
  ],
  exports: [TypeOrmModule, AddNewProjectService, CreateProjectService],
})
export class ProjectModule {}
