import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { Survey } from '../../Survey/entities/Survey.entity';
import { User } from '../../User/entities/User.entity';
import { SurveyResponseAnswer } from './SurveyResponseAnswer.entity';

/**
 * Entity responsible for representing a submitted survey response.
 */
@Entity({ name: 'surveys_responses' })
export class SurveyResponse {
  @PrimaryGeneratedColumn('identity', { type: 'int', name: 'id' })
  id!: number;

  @ManyToOne(() => Survey, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'survey_id' })
  survey!: Survey;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;

  @OneToMany(
    () => SurveyResponseAnswer,
    (answer: SurveyResponseAnswer) => answer.surveyResponse,
  )
  answers!: SurveyResponseAnswer[];

  @Column({ type: 'timestamp', name: 'submitted_at', nullable: true })
  submittedAt!: Date | null;

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
