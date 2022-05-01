import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

	async create(createUserDto: CreateUserDto): Promise<UserEntity> {
		const user = new UserEntity();
		Object.assign(user, createUserDto);

		return this.userRepository.save(user);
	}

	findAll(): string {
		return `This action returns all user`;
	}

	findOne(id: number): string {
		return `This action returns a #${id} user`;
	}

	update(id: number, updateUserDto: UpdateUserDto): string {
		return `This action updates a #${id} user`;
	}

	remove(id: number): string {
		return `This action removes a #${id} user`;
	}
}
