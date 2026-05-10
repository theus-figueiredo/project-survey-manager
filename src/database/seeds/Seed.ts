import * as bcrypt from 'bcryptjs';
import dataSource from '../../../typeorm.config';
import { Project } from '../../modules/Project/entities/Project.entity';
import { ProjectPhasesEnum } from '../../modules/Project/enums/ProjectPhases.enum';
import { ProjectStatusEnum } from '../../modules/Project/enums/ProjectStatus.enum';
import { PositionsEnum } from '../../modules/User/enums/Positions.enum';
import { RolesEnum } from '../../modules/User/enums/Roles.enum';
import { User } from '../../modules/User/entities/User.entity';

type UserSeedData = {
  email: string;
  name: string;
  role: RolesEnum;
  position: PositionsEnum;
};

type ProjectSeedData = {
  name: string;
  description: string | null;
  clientName: string;
  phase: ProjectPhasesEnum;
  totalPhases: number | null;
  status: ProjectStatusEnum;
};

const password = 'password';

const users: UserSeedData[] = [
  {
    email: 'admin.consultant@test.com',
    name: 'Admin Consultant',
    role: RolesEnum.ADMIN,
    position: PositionsEnum.CONSULTANT,
  },
  {
    email: 'admin.customer@test.com',
    name: 'Admin Customer',
    role: RolesEnum.ADMIN,
    position: PositionsEnum.CUSTOMER,
  },
  {
    email: 'user.consultant@test.com',
    name: 'User Consultant',
    role: RolesEnum.USER,
    position: PositionsEnum.CONSULTANT,
  },
  {
    email: 'user.customer@test.com',
    name: 'User Customer',
    role: RolesEnum.USER,
    position: PositionsEnum.CUSTOMER,
  },
];

const projects: ProjectSeedData[] = [
  {
    name: 'EYF Onboarding',
    description: 'Initial onboarding project seeded for local development.',
    clientName: 'EYF',
    phase: ProjectPhasesEnum.PLANNING,
    totalPhases: 3,
    status: ProjectStatusEnum.IN_PROGRESS,
  },
  {
    name: 'EYF Growth',
    description: 'Growth project seeded for local development.',
    clientName: 'EYF',
    phase: ProjectPhasesEnum.PLANNING,
    totalPhases: 3,
    status: ProjectStatusEnum.IN_PROGRESS,
  },
];

/**
 * Creates or updates the user seed records.
 *
 * @returns {Promise<User[]>} A promise that resolves to the persisted users.
 */
async function seedUsers(): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash(password, 10);
  const seededUsers: User[] = [];

  for (const userSeed of users) {
    const user =
      (await userRepository.findOne({
        where: { email: userSeed.email },
        withDeleted: true,
      })) ?? userRepository.create({ email: userSeed.email });

    user.name = userSeed.name;
    user.role = userSeed.role;
    user.position = userSeed.position;
    user.password = hashedPassword;
    user.deletedAt = null;

    seededUsers.push(await userRepository.save(user));
  }

  return seededUsers;
}

/**
 * Creates or updates the project seed records and attaches all seeded users to them.
 *
 * @param {User[]} seededUsers - Users that must be attached to each seeded project.
 * @returns {Promise<Project[]>} A promise that resolves to the persisted projects.
 */
async function seedProjects(seededUsers: User[]): Promise<Project[]> {
  const projectRepository = dataSource.getRepository(Project);
  const projectLeader = seededUsers.find(
    (user: User) => user.position === PositionsEnum.CONSULTANT,
  );

  if (!projectLeader) {
    throw new Error('No consultant user found to use as project leader.');
  }

  const seededProjects: Project[] = [];

  for (const projectSeed of projects) {
    const project =
      (await projectRepository.findOne({
        where: { name: projectSeed.name },
        relations: { users: true, projectLeader: true },
        withDeleted: true,
      })) ?? projectRepository.create({ name: projectSeed.name });

    project.description = projectSeed.description;
    project.clientName = projectSeed.clientName;
    project.projectLeader = projectLeader;
    project.users = seededUsers;
    project.startDate = null;
    project.phase = projectSeed.phase;
    project.totalPhases = projectSeed.totalPhases;
    project.status = projectSeed.status;
    project.completedAt = null;
    project.deletedAt = null;

    seededProjects.push(await projectRepository.save(project));
  }

  return seededProjects;
}

/**
 * Runs all database seeds.
 *
 * @returns {Promise<void>} A promise that resolves when all seeds have finished.
 */
async function runSeeds(): Promise<void> {
  await dataSource.initialize();

  try {
    const seededUsers = await seedUsers();
    const seededProjects = await seedProjects(seededUsers);

    console.log(
      `Seed completed: ${seededUsers.length} users and ${seededProjects.length} projects upserted.`,
    );
  } finally {
    await dataSource.destroy();
  }
}

void runSeeds().catch((error: Error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
