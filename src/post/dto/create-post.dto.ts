import { IsArray, IsString } from 'class-validator';

export class CreatePostDto {
	@IsString()
	title: string;

	@IsString()
	body: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];
}
