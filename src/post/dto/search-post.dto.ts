import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

enum PostViewsEnum {
	DESC = 'DESC',
	ASC = 'ASC',
}

export class SearchPostDto extends PartialType(CreatePostDto) {
	@IsOptional()
	@IsEnum(PostViewsEnum)
	views?: PostViewsEnum;

	@IsOptional()
	@IsNumber()
	skip = 0;

	@IsOptional()
	@IsNumber()
	take = 10;
}
