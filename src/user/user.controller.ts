import { Controller, Get, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { User } from './decorators/user.decorator';
import { SearchUserDto } from './dto/search-user.dto';
import { SequenceResponce } from '@app/types/sequence-responce.interface';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async findAll(): Promise<UserEntity[]> {
		return this.userService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async me(@User() currentUser: UserEntity): Promise<UserEntity> {
		return this.userService.findById(currentUser.id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('me')
	async update(
		@User() currentUser: UserEntity,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UserEntity> {
		return this.userService.update(currentUser.id, updateUserDto);
	}

	@Get('search')
	async search(@Query() searchUserDto: SearchUserDto): Promise<SequenceResponce<UserEntity>> {
		return this.userService.search(searchUserDto);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<UserEntity> {
		return this.userService.findById(+id);
	}
}
