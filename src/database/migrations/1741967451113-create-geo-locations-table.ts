import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGeoLocationsTable1741967451113
  implements MigrationInterface
{
  name = 'CreateGeoLocationsTable1741967451113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "geo_locations" (
                "id" uuid NOT NULL,
                "address_id" uuid NOT NULL,
                "latitude" numeric(10, 6) NOT NULL,
                "longtitude" numeric(10, 6) NOT NULL,
                CONSTRAINT "PK geo_location_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses" DROP CONSTRAINT "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ALTER COLUMN "user_id"
            SET NOT NULL
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
            ALTER TABLE "addresses"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD CONSTRAINT "id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses" DROP COLUMN "zip_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD "zipCode" character varying(20) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "addresses"
            ADD "userId" integer NOT NULL
        `);
    await queryRunner.query(`
            DROP TABLE "geo_locations"
        `);
  }
}
