import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndPosts1651558608610 implements MigrationInterface {
	name = 'CreateUserAndPosts1651558608610';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "tags" text, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "posts"`);
		await queryRunner.query(`DROP TABLE "users"`);
	}
}
