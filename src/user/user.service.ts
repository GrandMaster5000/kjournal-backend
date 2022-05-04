import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
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

	findById(id: number): Promise<UserEntity> {
		return this.userRepository.findOne(id);
	}

	findByCond(cond: LoginUserDto): Promise<UserEntity> {
		return this.userRepository.findOne(cond);
	}

	update(id: number, updateUserDto: UpdateUserDto): string {
		return `This action updates a #${id} user`;
	}

	remove(id: number): string {
		return `This action removes a #${id} user`;
	}
}
