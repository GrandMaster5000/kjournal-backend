import { PostEntity } from '@app/post/entities/post.entity';
import { POST_DOES_NOT_EXIST } from '@app/post/post.constants';
import { UserService } from '@app/user/user.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { COMMENT_DOES_NOT_EXIST, NO_ACCESS_THIS_COMMENT } from './comment.constants';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
		@InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
		private readonly userService: UserService,
	) {}

	async create(createCommentDto: CreateCommentDto, currentUserId: number): Promise<CommentEntity> {
		const post = await this.postRepository.findOne(createCommentDto.postId);

		if (!post) {
			throw new NotFoundException(POST_DOES_NOT_EXIST);
		}

		const user = await this.userService.findById(currentUserId);
		return this.commentRepository.save({
			text: createCommentDto.text,
			post,
			user,
		});
	}

	async update(
		id: number,
		updateCommentDto: UpdateCommentDto,
		currentUserId: number,
	): Promise<CommentEntity> {
		const comment = await this.findOne(id);

		if (comment.user.id !== currentUserId) {
			throw new ForbiddenException(NO_ACCESS_THIS_COMMENT);
		}

		Object.assign(comment, {
			text: updateCommentDto.text ?? comment.text,
		});
		return this.commentRepository.save(comment);
	}

	async remove(id: number, currentUserId: number): Promise<DeleteResult> {
		const comment = await this.findOne(id);

		if (comment.user.id !== currentUserId) {
			throw new ForbiddenException(NO_ACCESS_THIS_COMMENT);
		}
		return this.commentRepository.delete(id);
	}

	async findAll(
		postId: number,
	): Promise<(Omit<CommentEntity, 'post'> & { post: { id: number; title: string } })[]> {
		const qb = this.commentRepository.createQueryBuilder('c');

		if (postId) {
			qb.where('c.postId = :postId', { postId });
		}

		const arr = await qb
			.leftJoinAndSelect('c.post', 'post')
			.leftJoinAndSelect('c.user', 'user')
			.getMany();

		return arr.map((obj) => {
			return {
				...obj,
				post: { id: obj.post.id, title: obj.post.title },
			};
		});
	}

	async findOne(id: number): Promise<CommentEntity> {
		const comment = await this.commentRepository.findOne(id);

		if (!comment) {
			throw new NotFoundException(COMMENT_DOES_NOT_EXIST);
		}

		return comment;
	}
}
