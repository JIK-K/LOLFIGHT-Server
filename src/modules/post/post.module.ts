import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostMapper } from './mapper/post.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Board } from '../board/entities/board.entity';
import { Member } from '../member/entities/member.entity';
import { PostLike } from './entities/post_like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Board]),
    TypeOrmModule.forFeature([Member]),
    TypeOrmModule.forFeature([PostLike]),
  ],
  controllers: [PostController],
  providers: [PostService, PostMapper],
  exports: [PostService, PostMapper],
})
export class PostModule {}
