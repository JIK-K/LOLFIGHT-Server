import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { PostDTO } from '../DTOs/post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostMapper {
  constructor() {
    // empty
  }

  toDTO(postEntity: Post): PostDTO {
    const {
      id,
      board,
      postTitle,
      postContent,
      // postWriter,
      postViews,
      postLikes,
      postComments,
      deletedAt,
      deletedTrue,
      createdAt: postDate,
      member,
    } = postEntity;

    return (
      Builder<PostDTO>()
        .id(id)
        .postTitle(postTitle)
        .postContent(postContent)
        // .postWriter(postWriter)
        .postBoard(board.boardType)
        .postViews(postViews)
        .postLikes(postLikes)
        .postComments(postComments)
        .postDate(postDate)
        .deletedAt(deletedAt)
        .deletedTrue(deletedTrue)
        .postWriter(member.memberName)
        .build()
    );
  }

  toDTOList(postEntites: Post[]): PostDTO[] {
    const postDTOList = [];
    postEntites.forEach((postEntity) =>
      postDTOList.push(this.toDTO(postEntity)),
    );

    return postDTOList;
  }
}
