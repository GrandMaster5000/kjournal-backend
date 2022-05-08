import { CommentEntity } from '@app/comment/entities/comment.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	fullName: string;

	@Column({ unique: true })
	email: string;

	@OneToMany(() => CommentEntity, (comment) => comment.user, {
		eager: false,
		nullable: true,
	})
	comments: CommentEntity[];

	@Column({ nullable: true, select: false })
	password?: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
