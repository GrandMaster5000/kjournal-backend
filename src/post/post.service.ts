import { SequenceResponce } from '@app/types/sequence-responce.interface';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { UserService } from '@app/user/user.service';
import { NO_ACCESS_THIS_POST, POST_DOES_NOT_EXIST } from './post.constants';

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
		private readonly userService: UserService,
	) {}

	async create(createPostDto: CreatePostDto, currentUserId: number): Promise<PostEntity> {
		const firstParagraph = createPostDto.body.find((p) => p.type === 'paragraph')?.data?.text;

		const user = await this.userService.findById(currentUserId);
		return this.postRepository.save({
			title: createPostDto.title,
			body: createPostDto.body,
			tags: createPostDto.tags,
			description: firstParagraph || '',
			user,
		});
	}

	async update(
		id: number,
		updatePostDto: UpdatePostDto,
		currentUserId: number,
	): Promise<PostEntity> {
		const post = await this.findOne(id);

		const firstParagraph = updatePostDto.body.find((p) => p.type === 'paragraph')?.data?.text;

		if (post.user.id !== currentUserId) {
			throw new ForbiddenException(NO_ACCESS_THIS_POST);
		}

		Object.assign(post, {
			title: updatePostDto.title ?? post.title,
			body: updatePostDto.body ?? post.body,
			tags: updatePostDto.tags ?? post.tags,
			description: firstParagraph || '',
		});
		return this.postRepository.save(post);
	}

	async remove(id: number, currentUserId: number): Promise<DeleteResult> {
		const post = await this.findOne(id);

		if (post.user.id !== currentUserId) {
			throw new ForbiddenException(NO_ACCESS_THIS_POST);
		}

		return this.postRepository.delete(id);
	}

	async findAll(): Promise<SequenceResponce<PostEntity>> {
		const qb = this.postRepository.createQueryBuilder();

		qb.leftJoinAndSelect('p.user', 'user');

		qb.orderBy('createdAt', 'DESC');
		qb.take(10);

		const [items, total] = await qb.getManyAndCount();

		return {
			items,
			total,
		};
	}

	async findPopular(): Promise<SequenceResponce<PostEntity>> {
		const qb = this.postRepository.createQueryBuilder('p');

		qb.leftJoinAndSelect('p.user', 'user');

		qb.orderBy('views', 'DESC');
		qb.limit(10);

		const [items, total] = await qb.getManyAndCount();

		return {
			items,
			total,
		};
	}

	async search(searchPostDto: SearchPostDto): Promise<SequenceResponce<PostEntity>> {
		const { skip, take, body, views, tags, title } = searchPostDto;

		const qb = this.postRepository.createQueryBuilder('p');

		qb.leftJoinAndSelect('p.user', 'user');

		qb.offset(skip);
		qb.take(take);

		if (views) {
			qb.orderBy('views', views);
		}

		if (body) {
			qb.andWhere(`p.body ILIKE :body`, {
				body: `%${body}%`,
			});
		}

		if (title) {
			qb.andWhere(`p.title ILIKE :title`, {
				title: `%${title}%`,
			});
		}

		if (tags) {
			qb.andWhere(`p.tags ILIKE :tags`, {
				tags: `%${tags}%`,
			});
		}

		const [items, total] = await qb.getManyAndCount();

		return { items, total };
	}

	async findOne(id: number): Promise<PostEntity> {
		const post = await this.postRepository.findOne(id);

		if (!post) {
			throw new NotFoundException(POST_DOES_NOT_EXIST);
		}

		Object.assign(post, { views: ++post.views });

		return this.postRepository.save(post);
	}
}
