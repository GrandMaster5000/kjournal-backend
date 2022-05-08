import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { UserId } from '@app/user/decorators/user.decorator';
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Controller('comments')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(
		@UserId() currentUserId: number,
		@Body() createCommentDto: CreateCommentDto,
	): Promise<CommentEntity> {
		return this.commentService.create(createCommentDto, currentUserId);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async update(
		@UserId() currentUserId: number,
		@Param('id') id: string,
		@Body() updateCommentDto: UpdateCommentDto,
	): Promise<CommentEntity> {
		return this.commentService.update(+id, updateCommentDto, currentUserId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@UserId() currentUserId: number, @Param('id') id: string): Promise<DeleteResult> {
		return this.commentService.remove(+id, currentUserId);
	}

	@Get()
	async findAll(
		@Query('postId') postId: number,
	): Promise<(Omit<CommentEntity, 'post'> & { post: { id: number; title: string } })[]> {
		return this.commentService.findAll(postId);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<CommentEntity> {
		return this.commentService.findOne(+id);
	}
}
