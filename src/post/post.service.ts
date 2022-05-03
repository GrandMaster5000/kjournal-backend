import { SequenceResponce } from '@app/types/sequence-responce.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { POST_DOES_NOT_EXIST } from './post.constants';

@Injectable()
export class PostService {
	constructor(@InjectRepository(PostEntity) private postRepository: Repository<PostEntity>) {}

	async create(createPostDto: CreatePostDto): Promise<PostEntity> {
		return this.postRepository.save(createPostDto);
	}

	async findAll(): Promise<SequenceResponce<PostEntity>> {
		const qb = this.postRepository.createQueryBuilder();

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

	async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
		const post = await this.findOne(id);

		Object.assign(post, updatePostDto);
		return this.postRepository.save(post);
	}

	async remove(id: number): Promise<DeleteResult> {
		await this.findOne(id);
		return this.postRepository.delete(id);
	}
}
