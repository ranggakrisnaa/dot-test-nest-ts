import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { HealthModule } from './health/health.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule, PostModule, CommentModule],
})
export class ApiModule {}
