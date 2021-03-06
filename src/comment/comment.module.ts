import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { PostEntity } from '@app/post/entities/post.entity';
import { UserModule } from '@app/user/user.module';

@Module({
	imports: [UserModule, TypeOrmModule.forFeature([CommentEntity, PostEntity])],
	controllers: [CommentController],
	providers: [CommentService],
})
export class CommentModule {}
