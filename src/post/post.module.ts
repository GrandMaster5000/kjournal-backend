import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserModule } from '@app/user/user.module';

@Module({
	imports: [UserModule, TypeOrmModule.forFeature([PostEntity])],
	controllers: [PostController],
	providers: [PostService],
})
export class PostModule {}
