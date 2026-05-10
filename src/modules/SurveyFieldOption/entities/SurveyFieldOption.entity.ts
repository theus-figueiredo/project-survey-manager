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
import { SurveyField } from '../../SurveyField/entities/SurveyField.entity';

/**
 * Entity responsible for representing options attached to survey fields.
 */
@Entity({ name: 'survey_field_options' })
export class SurveyFieldOption {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @ManyToOne(() => SurveyField, (field: SurveyField) => field.options, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'field_id' })
  field!: SurveyField;

  @Column({ type: 'varchar', length: 255, name: 'value' })
  value!: string;

  @Column({ type: 'int', name: 'order' })
  order!: number;

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
