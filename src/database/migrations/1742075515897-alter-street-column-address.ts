import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterStreetColumnAddress1742075515897
  implements MigrationInterface
{
  name = 'AlterStreetColumnAddress1742075515897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP CONSTRAINT "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses" DROP CONSTRAINT "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD "street" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses" DROP COLUMN "zip_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD "zip_code" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD CONSTRAINT "id" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD CONSTRAINT "id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "addresses" DROP CONSTRAINT "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP CONSTRAINT "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses" DROP COLUMN "zip_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD "zip_code" character varying(20) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses" DROP COLUMN "street"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD CONSTRAINT "id" FOREIGN KEY ("address_id", "user_id") REFERENCES "users"("id", "id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD CONSTRAINT "id" FOREIGN KEY ("address_id", "user_id") REFERENCES "addresses"("id", "id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
