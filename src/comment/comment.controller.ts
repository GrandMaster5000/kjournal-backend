import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
	async create(@Body() createCommentDto: CreateCommentDto): Promise<CommentEntity> {
		return this.commentService.create(createCommentDto);
	}

	@Get()
	async findAll(): Promise<CommentEntity[]> {
		return this.commentService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<CommentEntity> {
		return this.commentService.findOne(+id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateCommentDto: UpdateCommentDto,
	): Promise<CommentEntity> {
		return this.commentService.update(+id, updateCommentDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<DeleteResult> {
		return this.commentService.remove(+id);
	}
}
