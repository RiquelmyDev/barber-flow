import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: unknown, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || info;
    }
    const request = context.switchToHttp().getRequest();
    request.user = user;
    return user;
  }
}
