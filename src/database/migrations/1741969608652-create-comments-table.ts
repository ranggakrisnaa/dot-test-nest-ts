import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentsTable1741969608652 implements MigrationInterface {
  name = 'CreateCommentsTable1741969608652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "comments" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "post_id" uuid NOT NULL,
                "name" character varying(100) NOT NULL,
                "email" character varying(150) NOT NULL,
                "body" text NOT NULL,
                CONSTRAINT "PK_comment_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"
        `);
    await queryRunner.query(`
            DROP TABLE "comments"
        `);
  }
}
