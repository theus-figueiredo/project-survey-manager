import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectsTable1775652709551 implements MigrationInterface {
  name = 'CreateProjectsTable1775652709551';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."project_phase_enum" AS ENUM('PLANNING', 'EXECUTION', 'DELIVERY')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."project_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "client_name" character varying NOT NULL, "start_date" TIMESTAMP, "phase" "public"."project_phase_enum" NOT NULL, "total_phases" integer, "status" "public"."project_status_enum" NOT NULL, "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "project_leader" integer, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_users" ("project_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_4d392d4703ae37be0cc9a253175" PRIMARY KEY ("project_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a53b25fef9b1ac81501a2816a" ON "project_users" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_076af26ee5a7bbcce3f77bfddf" ON "project_users" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_8b3441bd9952a1171362d0c8c05" FOREIGN KEY ("project_leader") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_users" ADD CONSTRAINT "FK_3a53b25fef9b1ac81501a2816a5" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_users" ADD CONSTRAINT "FK_076af26ee5a7bbcce3f77bfddfb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_users" DROP CONSTRAINT "FK_076af26ee5a7bbcce3f77bfddfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_users" DROP CONSTRAINT "FK_3a53b25fef9b1ac81501a2816a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_8b3441bd9952a1171362d0c8c05"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_076af26ee5a7bbcce3f77bfddf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3a53b25fef9b1ac81501a2816a"`,
    );
    await queryRunner.query(`DROP TABLE "project_users"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."project_phase_enum"`);
  }
}
