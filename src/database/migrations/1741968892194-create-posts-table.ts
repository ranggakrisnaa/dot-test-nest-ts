import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostsTable1741968892194 implements MigrationInterface {
  name = 'CreatePostsTable1741968892194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "posts" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "title" character varying(150) NOT NULL,
                "body" text NOT NULL,
                CONSTRAINT "PK_post_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD "name" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD "catchPhrase" character varying(150) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD "bs" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "companies" DROP CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies" DROP CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "companies" DROP COLUMN "bs"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies" DROP COLUMN "catchPhrase"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            DROP TABLE "posts"
        `);
  }
}
