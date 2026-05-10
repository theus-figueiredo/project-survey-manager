import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

type DatabaseEnv = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getConfigValue(name: string, configService?: ConfigService): string {
  if (configService) {
    return configService.getOrThrow<string>(name);
  }

  return getRequiredEnv(name);
}

function getConfigNumber(name: string, configService?: ConfigService): number {
  const value = Number(getConfigValue(name, configService));

  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return value;
}

export function getDatabaseEnv(configService?: ConfigService): DatabaseEnv {
  return {
    host: getConfigValue('DB_HOST', configService),
    port: getConfigNumber('DB_PORT', configService),
    username: getConfigValue('DB_USERNAME', configService),
    password: getConfigValue('DB_PASSWORD', configService),
    database: getConfigValue('DB_DATABASE', configService),
  };
}

export function getTypeOrmBaseOptions(
  configService?: ConfigService,
): DataSourceOptions {
  const databaseEnv = getDatabaseEnv(configService);

  return {
    type: 'postgres',
    host: databaseEnv.host,
    port: databaseEnv.port,
    username: databaseEnv.username,
    password: databaseEnv.password,
    database: databaseEnv.database,
    synchronize: false,
    logging:
      process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    migrationsTableName: 'typeorm_migrations',
    entities: [join(process.cwd(), 'src/modules/**/*.entity{.ts,.js}')],
    migrations: [join(process.cwd(), 'src/database/migrations/*{.ts,.js}')],
  };
}

export function getTypeOrmModuleOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const { entities, migrations, ...baseOptions } =
    getTypeOrmBaseOptions(configService);

  return {
    ...baseOptions,
    autoLoadEntities: true,
  };
}
