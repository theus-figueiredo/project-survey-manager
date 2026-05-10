import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Survey } from '../../Survey/entities/Survey.entity';
import { SurveyFieldOption } from '../../SurveyFieldOption/entities/SurveyFieldOption.entity';
import { SurveyFieldTypesEnum } from '../enums/SurveyFieldTypes.enum';

/**
 * Entity responsible for representing survey fields and their configuration.
 */
@Entity({ name: 'survey_fields' })
export class SurveyField {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @ManyToOne(() => Survey, (survey: Survey) => survey.fields, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'survey_id' })
  survey!: Survey;

  @Column({
    type: 'enum',
    enum: SurveyFieldTypesEnum,
    enumName: 'survey_field_type_enum',
    name: 'type',
  })
  type!: SurveyFieldTypesEnum;

  @Column({ type: 'varchar', length: 255, name: 'label' })
  label!: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'placeholder',
    nullable: true,
  })
  placeholder!: string | null;

  @Column({
    type: 'boolean',
    name: 'required',
    default: false,
  })
  required!: boolean;

  @Column({ type: 'int', name: 'order' })
  order!: number;

  @OneToMany(() => SurveyFieldOption, (option: SurveyFieldOption) => option.field)
  options!: SurveyFieldOption[];

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
