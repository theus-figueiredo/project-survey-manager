import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getTypeOrmModuleOptions } from './config/database.config';
import { AuthModule } from './modules/Auth/Auth.module';
import { ProjectModule } from './modules/Project/Project.module';
import { SurveyFieldOptionModule } from './modules/SurveyFieldOption/SurveyFieldOption.module';
import { SurveyFieldModule } from './modules/SurveyField/SurveyField.module';
import { SurveyModule } from './modules/Survey/Survey.module';
import { SurveyResponseModule } from './modules/SurveyResponse/SurveyResponse.module';
import { UserModule } from './modules/User/User.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmModuleOptions(configService),
    }),
    AuthModule,
    ProjectModule,
    SurveyFieldOptionModule,
    SurveyFieldModule,
    SurveyModule,
    SurveyResponseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
