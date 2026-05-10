import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/Auth.module';
import { Project } from '../Project/entities/Project.entity';
import { SurveyFieldModule } from '../SurveyField/SurveyField.module';
import { SurveyResponse } from '../SurveyResponse/entities/SurveyResponse.entity';
import { UserModule } from '../User/User.module';
import { SurveyController } from './Survey.controller';
import { Survey } from './entities/Survey.entity';
import { CreateSurveyService } from './services/CreateSurvey.service';
import { GetSurveyService } from './services/GetSurvey.service';
import { ListSurveyService } from './services/ListSurvey.service';
import { UpdateSurveyService } from './services/UpdateSurvey.service';

/**
 * Module responsible for registering the Survey entity in the Nest container.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Survey, SurveyResponse, Project]),
    AuthModule,
    SurveyFieldModule,
    UserModule,
  ],
  controllers: [SurveyController],
  providers: [
    CreateSurveyService,
    GetSurveyService,
    ListSurveyService,
    UpdateSurveyService,
  ],
  exports: [
    TypeOrmModule,
    CreateSurveyService,
    GetSurveyService,
    ListSurveyService,
    UpdateSurveyService,
  ],
})
export class SurveyModule {}
