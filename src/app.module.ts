import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import getOrmConfig from '@app/configs/orm.config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot(getOrmConfig),
		UserModule,
		PostModule,
		CommentModule,
	],
})
export class AppModule {}
