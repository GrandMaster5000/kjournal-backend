import { UserEntity } from '@app/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { OutputBlockData } from '../dto/create-post.dto';

@Entity({ name: 'posts' })
export class PostEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ type: 'jsonb' })
	body: OutputBlockData[];

	@Column({ default: '' })
	description: string;

	@ManyToOne(() => UserEntity, { eager: true, nullable: false })
	user: UserEntity;

	@Column({ default: 0 })
	views: number;

	@Column({ nullable: true })
	tags?: string[];

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
