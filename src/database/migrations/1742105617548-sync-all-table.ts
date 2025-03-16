import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncAllTable1742105617548 implements MigrationInterface {
  name = 'SyncAllTable1742105617548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies" DROP CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD "name" character varying(100) NOT NULL
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies" DROP CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "companies" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD CONSTRAINT "FK_ee0839cba07cb0c52602021ad4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
