import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/Auth.module';
import { UserModule } from '../User/User.module';
import { SurveyFieldOptionController } from './SurveyFieldOption.controller';
import { SurveyFieldOption } from './entities/SurveyFieldOption.entity';
import { CreateSurveyFieldOptionService } from './services/CreateSurveyFieldOption.service';
import { UpdateSurveyFieldOptionService } from './services/UpdateSurveyFieldOption.service';

/**
 * Module responsible for registering the SurveyFieldOption entity in the Nest container.
 */
@Module({
  imports: [TypeOrmModule.forFeature([SurveyFieldOption]), AuthModule, UserModule],
  controllers: [SurveyFieldOptionController],
  providers: [
    CreateSurveyFieldOptionService,
    UpdateSurveyFieldOptionService,
  ],
  exports: [
    TypeOrmModule,
    CreateSurveyFieldOptionService,
    UpdateSurveyFieldOptionService,
  ],
})
export class SurveyFieldOptionModule {}
