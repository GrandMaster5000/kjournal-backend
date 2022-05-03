import { PostEntity } from '@app/post/entities/post.entity';
import { POST_DOES_NOT_EXIST } from '@app/post/post.constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { COMMENT_DOES_NOT_EXIST } from './comment.constants';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
		@InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
	) {}

	async create(createCommentDto: CreateCommentDto): Promise<CommentEntity> {
		const post = await this.postRepository.findOne(createCommentDto.postId);

		if (!post) {
			throw new NotFoundException(POST_DOES_NOT_EXIST);
		}

		return this.commentRepository.save({
			text: createCommentDto.text,
			post: post,
		});
	}

	async findAll(): Promise<CommentEntity[]> {
		return this.commentRepository.find();
	}

	async findOne(id: number): Promise<CommentEntity> {
		const comment = await this.commentRepository.findOne(id);

		if (!comment) {
			throw new NotFoundException(COMMENT_DOES_NOT_EXIST);
		}

		return comment;
	}

	async update(id: number, updateCommentDto: UpdateCommentDto): Promise<CommentEntity> {
		const comment = await this.findOne(id);

		Object.assign(comment, updateCommentDto);
		return this.commentRepository.save(comment);
	}

	async remove(id: number): Promise<DeleteResult> {
		await this.findOne(id);
		return this.commentRepository.delete(id);
	}
}
