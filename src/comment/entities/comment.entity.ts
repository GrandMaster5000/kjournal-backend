import { PostEntity } from '@app/post/entities/post.entity';
import { UserEntity } from '@app/user/entities/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

@Entity({ name: 'comment' })
export class CommentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	text: string;

	@ManyToOne(() => UserEntity, { nullable: false })
	@JoinColumn({ name: 'userId' })
	user: UserEntity;

	@ManyToOne(() => PostEntity, { nullable: false })
	@JoinColumn({ name: 'postId' })
	post: PostEntity;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
