import { USER_EMAIL_NOT_FOUND_ERROR, USER_NOT_FOUND } from '@app/auth/auth.constants';
import { SequenceResponce } from '@app/types/sequence-responce.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
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

	async findAll(): Promise<UserEntity[]> {
		return this.userRepository.find();
	}

	async findById(id: number): Promise<UserEntity> {
		const user = await this.userRepository.findOne(id);

		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		return user;
	}

	async findByCond(cond: Partial<UserEntity>): Promise<UserEntity> {
		const user = await this.userRepository.findOne(cond);

		if (!user) {
			throw new NotFoundException(USER_EMAIL_NOT_FOUND_ERROR);
		}

		return user;
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const post = await this.findById(id);

		Object.assign(post, updateUserDto);
		return this.userRepository.save(post);
	}

	async search(searchPostDto: SearchUserDto): Promise<SequenceResponce<UserEntity>> {
		const { fullName, email, skip, take } = searchPostDto;

		const qb = this.userRepository.createQueryBuilder('u');

		qb.offset(skip);
		qb.take(take);

		if (email) {
			qb.andWhere(`u.body ILIKE :body`, {
				body: `%${email}%`,
			});
		}

		if (fullName) {
			qb.andWhere(`u.title ILIKE :title`, {
				title: `%${fullName}%`,
			});
		}

		const [items, total] = await qb.getManyAndCount();

		return { items, total };
	}
}
