import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { SequenceResponce } from '@app/types/sequence-responce.interface';
import { SearchPostDto } from './dto/search-post.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(
		@User() currentUser: UserEntity,
		@Body() createPostDto: CreatePostDto,
	): Promise<PostEntity> {
		return this.postService.create(createPostDto);
	}

	@Get()
	async findAll(): Promise<SequenceResponce<PostEntity>> {
		return this.postService.findAll();
	}

	@Get('/popular')
	async getPopularPosts(): Promise<SequenceResponce<PostEntity>> {
		return this.postService.findPopular();
	}

	@Get('/search')
	async searchPosts(@Query() searchPostDto: SearchPostDto): Promise<SequenceResponce<PostEntity>> {
		return this.postService.search(searchPostDto);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<PostEntity> {
		return this.postService.findOne(+id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
		return this.postService.update(+id, updatePostDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		this.postService.remove(+id);
	}
}
