import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionsTable1742024798358 implements MigrationInterface {
  name = 'CreateSessionsTable1742024798358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "refresh_token" text NOT NULL,
                "ip_address" character varying(50) NOT NULL,
                "device" character varying(255) NOT NULL,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
  }
}
