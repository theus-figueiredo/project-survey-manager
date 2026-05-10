import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SurveyFieldOption } from '../../SurveyFieldOption/entities/SurveyFieldOption.entity';
import { SurveyField } from '../../SurveyField/entities/SurveyField.entity';
import { SurveyResponse } from './SurveyResponse.entity';

/**
 * Entity responsible for representing a single answer inside a survey response.
 */
@Entity({ name: 'survey_response_answers' })
export class SurveyResponseAnswer {
  @PrimaryGeneratedColumn('identity', { type: 'int', name: 'id' })
  id!: number;

  @ManyToOne(
    () => SurveyResponse,
    (surveyResponse: SurveyResponse) => surveyResponse.answers,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'survey_response_id' })
  surveyResponse!: SurveyResponse;

  @ManyToOne(() => SurveyField, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'survey_field_id' })
  surveyField!: SurveyField;

  @ManyToOne(() => SurveyFieldOption, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'survey_option_id' })
  surveyOption!: SurveyFieldOption | null;

  @Column({ type: 'text', name: 'value', nullable: true })
  value!: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt!: Date | null;
}
