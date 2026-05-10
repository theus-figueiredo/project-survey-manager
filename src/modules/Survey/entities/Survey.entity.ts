import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../Project/entities/Project.entity';
import { User } from '../../User/entities/User.entity';
import { SurveyField } from '../../SurveyField/entities/SurveyField.entity';

/**
 * Entity responsible for representing surveys and their relationships.
 */
@Entity({ name: 'surveys' })
export class Survey {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title!: string;

  @Column({ type: 'boolean', name: 'default', nullable: true })
  default!: boolean | null;

  @ManyToMany(() => Project, (project: Project) => project.surveys)
  @JoinTable({
    name: 'project_surveys',
    joinColumn: {
      name: 'survey_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
  })
  projects!: Project[];

  @OneToMany(() => SurveyField, (field: SurveyField) => field.survey)
  fields!: SurveyField[];

  @ManyToOne(() => User, (user: User) => user.createdSurveys, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

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
