import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { CurrentUser } from '../../declarations';

export const CurrentUserDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
