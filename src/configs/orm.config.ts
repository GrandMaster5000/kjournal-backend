import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '@app/user/entities/user.entity';
dotenv.config();

const getOrmConfig: ConnectionOptions = {
	type: 'postgres',
	host: process.env.DATABASE_HOST,
	port: +process.env.DATABASE_PORT,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	entities: [UserEntity],
	synchronize: false,
	migrations: ['src/migrations/**/*{.ts,.js}'],
	cli: {
		migrationsDir: 'src/migrations',
	},
};

export default getOrmConfig;