import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCompanyColumn1742025932473 implements MigrationInterface {
  name = 'AlterCompanyColumn1742025932473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies"
                RENAME COLUMN "catchPhrase" TO "catch_phrase"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies"
                RENAME COLUMN "catch_phrase" TO "catchPhrase"
        `);
  }
}
