import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users.service.js';
import type { User } from '../user.entity.js';

type RequestWithCurrentUser = Request & {
  currentUser: User | null;
};

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(
    req: RequestWithCurrentUser,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.session?.userId;
    req.currentUser = null;

    if (userId === null) {
      return next();
    }

    try {
      req.currentUser = await this.usersService.findOne(userId);
    } catch (error) {
      return next(error);
    }

    next();
  }
}
