import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
		return this.postService.create(createPostDto);
	}

	@Get()
	async findAll(): Promise<PostEntity[]> {
		return this.postService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<PostEntity> {
		return this.postService.findOne(+id);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
		return this.postService.update(+id, updatePostDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		this.postService.remove(+id);
	}
}
