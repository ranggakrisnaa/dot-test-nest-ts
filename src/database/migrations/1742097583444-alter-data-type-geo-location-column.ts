import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDataTypeGeoLocationColumn1742097583444
  implements MigrationInterface
{
  name = 'AlterDataTypeGeoLocationColumn1742097583444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "lat"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "lat" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "lng"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "lng" character varying(100) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "lng"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "lng" numeric(10, 6) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "lat"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "lat" numeric(10, 6) NOT NULL
        `);
  }
}
