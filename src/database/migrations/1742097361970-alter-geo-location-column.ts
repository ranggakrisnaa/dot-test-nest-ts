import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterGeoLocationColumn1742097361970 implements MigrationInterface {
  name = 'AlterGeoLocationColumn1742097361970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "latitude"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "longtitude"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "lat" numeric(10, 6) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "lng" numeric(10, 6) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "lng"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations" DROP COLUMN "lat"
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "longtitude" numeric(10, 6) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "geo_locations"
            ADD "latitude" numeric(10, 6) NOT NULL
        `);
  }
}
