import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { POST_DOES_NOT_EXIST } from './post.constants';

@Injectable()
export class PostService {
	constructor(@InjectRepository(PostEntity) private postRepository: Repository<PostEntity>) {}

	async create(createPostDto: CreatePostDto): Promise<PostEntity> {
		return this.postRepository.save(createPostDto);
	}

	async findAll(): Promise<PostEntity[]> {
		return this.postRepository.find();
	}

	async findOne(id: number): Promise<PostEntity> {
		const post = await this.postRepository.findOne(id);
		if (!post) {
			throw new NotFoundException(POST_DOES_NOT_EXIST);
		}

		return post;
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
