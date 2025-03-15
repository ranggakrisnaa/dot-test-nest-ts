import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterIdCompany1742056004190 implements MigrationInterface {
  name = 'AlterIdCompany1742056004190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies"
            ALTER COLUMN "id"
            SET DEFAULT uuid_generate_v4()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies"
            ALTER COLUMN "id" DROP DEFAULT
        `);
  }
}
