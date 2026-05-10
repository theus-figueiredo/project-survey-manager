import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/Auth.module';
import { SurveyModule } from '../Survey/Survey.module';
import { User } from '../User/entities/User.entity';
import { UserModule } from '../User/User.module';
import { SurveyResponseAnswerController } from './SurveyResponseAnswer.controller';
import { SurveyResponseController } from './SurveyResponse.controller';
import { SurveyResponseAnswer } from './entities/SurveyResponseAnswer.entity';
import { SurveyResponse } from './entities/SurveyResponse.entity';
import { CreateSurveyResponseAnswerService } from './services/CreateSurveyResponseAnswer.service';
import { CreateSurveyResponseAnswersBulkService } from './services/CreateSurveyResponseAnswersBulk.service';
import { CreateSurveyResponseService } from './services/CreateSurveyResponse.service';

/**
 * Module responsible for registering survey response entities in the Nest container.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyResponse, SurveyResponseAnswer, User]),
    AuthModule,
    SurveyModule,
    UserModule,
  ],
  controllers: [SurveyResponseController, SurveyResponseAnswerController],
  providers: [
    CreateSurveyResponseService,
    CreateSurveyResponseAnswerService,
    CreateSurveyResponseAnswersBulkService,
  ],
  exports: [TypeOrmModule],
})
export class SurveyResponseModule {}
