import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../../modules/Project/entities/Project.entity';
import { Survey } from '../../../modules/Survey/entities/Survey.entity';
import { PositionsEnum } from '../enums/Positions.enum';
import { RolesEnum } from '../enums/Roles.enum';

/**
 * Entity responsible for representing an application user.
 */
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email!: string;

  @Column({ type: 'varchar', name: 'password' })
  password!: string;

  @Column({ type: 'varchar', name: 'name' })
  name!: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    enumName: 'user_role_enum',
    name: 'role',
  })
  role!: RolesEnum;

  @Column({
    type: 'enum',
    enum: PositionsEnum,
    enumName: 'user_position_enum',
    name: 'position',
  })
  position!: PositionsEnum;

  @ManyToMany(() => Project, (project: Project) => project.users)
  projects!: Project[];

  @OneToMany(() => Project, (project: Project) => project.projectLeader)
  leaderProjects!: Project[];

  @OneToMany(() => Survey, (survey: Survey) => survey.createdBy)
  createdSurveys!: Survey[];

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
