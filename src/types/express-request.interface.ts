import { UserEntity } from '@app/user/entities/user.entity';
import { Request } from 'express';

export interface IExpressRequest extends Request {
	user?: UserEntity;
}
