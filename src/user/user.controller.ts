import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll(): string {
		return this.userService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<UserEntity> {
		return this.userService.findById(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): string {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string): string {
		return this.userService.remove(+id);
	}
}
