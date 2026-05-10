import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSurveysTables1775704310895 implements MigrationInterface {
    name = 'CreateSurveysTables1775704310895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "survey_field_options" ("id" SERIAL NOT NULL, "value" character varying(255) NOT NULL, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "field_id" integer NOT NULL, CONSTRAINT "PK_27409400d5148af4c2a8a5faad5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."survey_field_type_enum" AS ENUM('TEXT', 'EMAIL', 'PHONE_NUMBER', 'DATE', 'TEXT_AREA', 'SELECT', 'RADIO', 'CHECKBOX')`);
        await queryRunner.query(`CREATE TABLE "survey_fields" ("id" SERIAL NOT NULL, "type" "public"."survey_field_type_enum" NOT NULL, "label" character varying(255) NOT NULL, "placeholder" character varying(255), "required" boolean NOT NULL DEFAULT false, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "survey_id" integer NOT NULL, CONSTRAINT "PK_48a986ab67f104244ab56d0a133" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "surveys" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "default" boolean, "created_by" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1b5e3d4aaeb2321ffa98498c971" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_surveys" ("survey_id" integer NOT NULL, "project_id" integer NOT NULL, CONSTRAINT "PK_d85bdf77922a32f975befba11cd" PRIMARY KEY ("survey_id", "project_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4be6ebd43d1d0caa4865f0ff37" ON "project_surveys" ("survey_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_51ee617ccfb3287654046f3ef4" ON "project_surveys" ("project_id") `);
        await queryRunner.query(`ALTER TABLE "survey_field_options" ADD CONSTRAINT "FK_2132fe7205119e6cbd779b941af" FOREIGN KEY ("field_id") REFERENCES "survey_fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_fields" ADD CONSTRAINT "FK_440784dbe9210e55a6e6595bab7" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "surveys" ADD CONSTRAINT "FK_b395d649c64d92997cb33f4d572" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_surveys" ADD CONSTRAINT "FK_4be6ebd43d1d0caa4865f0ff379" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_surveys" ADD CONSTRAINT "FK_51ee617ccfb3287654046f3ef4b" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_surveys" DROP CONSTRAINT "FK_51ee617ccfb3287654046f3ef4b"`);
        await queryRunner.query(`ALTER TABLE "project_surveys" DROP CONSTRAINT "FK_4be6ebd43d1d0caa4865f0ff379"`);
        await queryRunner.query(`ALTER TABLE "surveys" DROP CONSTRAINT "FK_b395d649c64d92997cb33f4d572"`);
        await queryRunner.query(`ALTER TABLE "survey_fields" DROP CONSTRAINT "FK_440784dbe9210e55a6e6595bab7"`);
        await queryRunner.query(`ALTER TABLE "survey_field_options" DROP CONSTRAINT "FK_2132fe7205119e6cbd779b941af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51ee617ccfb3287654046f3ef4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be6ebd43d1d0caa4865f0ff37"`);
        await queryRunner.query(`DROP TABLE "project_surveys"`);
        await queryRunner.query(`DROP TABLE "surveys"`);
        await queryRunner.query(`DROP TABLE "survey_fields"`);
        await queryRunner.query(`DROP TYPE "public"."survey_field_type_enum"`);
        await queryRunner.query(`DROP TABLE "survey_field_options"`);
    }

}
