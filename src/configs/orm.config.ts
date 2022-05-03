import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '@app/user/entities/user.entity';
import { PostEntity } from '@app/post/entities/post.entity';
import { CommentEntity } from '@app/comment/entities/comment.entity';
dotenv.config();

const getOrmConfig: ConnectionOptions = {
	type: 'postgres',
	host: process.env.DATABASE_HOST,
	port: +process.env.DATABASE_PORT,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	entities: [UserEntity, PostEntity, CommentEntity],
	synchronize: true,
	migrations: ['src/migrations/**/*{.ts,.js}'],
	cli: {
		migrationsDir: 'src/migrations',
	},
};

export default getOrmConfig;
