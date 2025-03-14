import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAddressesTable1741966233429 implements MigrationInterface {
  name = 'CreateAddressesTable1741966233429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "addresses" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "suite" character varying(100) NOT NULL,
                "city" character varying(100) NOT NULL,
                "zip_code" character varying(20) NOT NULL,
                CONSTRAINT "PK_address_id" PRIMARY KEY ("id")
            )
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
            DROP TABLE "addresses"
        `);
  }
}
