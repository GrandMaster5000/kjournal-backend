import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OutputBlockData {
	@IsOptional()
	@IsString()
	id?: string;

	@IsNotEmpty()
	type: 'paragraph' | string;

	@IsNotEmpty()
	data: any;
}

export class CreatePostDto {
	@IsString()
	title: string;

	@IsArray()
	@ValidateNested()
	@Type(() => OutputBlockData)
	body: OutputBlockData[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}
