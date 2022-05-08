import { IExpressRequest } from '@app/types/express-request.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_: any, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<IExpressRequest>();

	if (!request.user) {
		return null;
	}

	return request.user.id;
});
