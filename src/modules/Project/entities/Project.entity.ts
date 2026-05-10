import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Survey } from '../../Survey/entities/Survey.entity';
import { User } from '../../User/entities/User.entity';
import { ProjectPhasesEnum } from '../enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../enums/ProjectStatus.enum';

/**
 * Entity responsible for representing a project and its user relationships.
 */
@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'varchar', name: 'name' })
  name!: string;

  @Column({ type: 'varchar', name: 'description', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', name: 'client_name' })
  clientName!: string;

  @ManyToOne(() => User, (user: User) => user.leaderProjects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'project_leader' })
  projectLeader!: User | null;

  @ManyToMany(() => User, (user: User) => user.projects)
  @JoinTable({
    name: 'project_users',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users!: User[];

  @ManyToMany(() => Survey, (survey: Survey) => survey.projects)
  surveys!: Survey[];

  @Column({ type: 'timestamp', name: 'start_date', nullable: true })
  startDate!: Date | null;

  @Column({
    type: 'enum',
    enum: ProjectPhasesEnum,
    enumName: 'project_phase_enum',
    name: 'phase',
  })
  phase!: ProjectPhasesEnum;

  @Column({ type: 'int', name: 'total_phases', nullable: true })
  totalPhases!: number | null;

  @Column({
    type: 'enum',
    enum: ProjectStatusEnum,
    enumName: 'project_status_enum',
    name: 'status',
  })
  status!: ProjectStatusEnum;

  @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
  completedAt!: Date | null;

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
