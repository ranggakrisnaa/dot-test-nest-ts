import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1741964718606 implements MigrationInterface {
  name = 'CreateUsersTable1741964718606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "username" character varying(50) NOT NULL,
                "email" character varying(150) NOT NULL,
                "password" character varying(150) NOT NULL,
                "phone" character varying(50) NOT NULL,
                "website" character varying(150) NOT NULL,
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "UQ_user_username" ON "users" ("username")
        `);
    await queryRunner.query(`
            CREATE INDEX "UQ_user_email" ON "users" ("email")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_username"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
