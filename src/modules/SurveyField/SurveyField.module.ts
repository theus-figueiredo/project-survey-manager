import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/Auth.module';
import { SurveyFieldOptionModule } from '../SurveyFieldOption/SurveyFieldOption.module';
import { UserModule } from '../User/User.module';
import { SurveyFieldController } from './SurveyField.controller';
import { SurveyField } from './entities/SurveyField.entity';
import { CreateSurveyFieldService } from './services/CreateSurveyField.service';
import { UpdateSurveyFieldService } from './services/UpdateSurveyField.service';

/**
 * Module responsible for registering the SurveyField entity in the Nest container.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyField]),
    AuthModule,
    SurveyFieldOptionModule,
    UserModule,
  ],
  controllers: [SurveyFieldController],
  providers: [CreateSurveyFieldService, UpdateSurveyFieldService],
  exports: [TypeOrmModule, CreateSurveyFieldService, UpdateSurveyFieldService],
})
export class SurveyFieldModule {}
