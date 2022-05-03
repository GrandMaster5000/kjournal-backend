import { PostEntity } from '@app/post/entities/post.entity';
import { UserEntity } from '@app/user/entities/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from 'typeorm';

@Entity({ name: 'comment' })
export class CommentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	text: string;

	@ManyToOne(() => UserEntity, { nullable: false })
	user: UserEntity;

	@ManyToOne(() => PostEntity, { nullable: false })
	post: PostEntity;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
