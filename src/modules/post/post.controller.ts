import {
  Body,
  Controller,
  Post,
  Logger,
  Bind,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './DTOs/post.dto';
import { ResponseDTO } from 'src/common/DTOs/response.dto';
import { ResponseUtil } from 'src/utils/response.util';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/configs/multer.config';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {
    // empty
  }

  private logger: Logger = new Logger();

  /**
   * Post 생성
   * @param postDTO
   * @returns
   */
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Bind(UploadedFile())
  async create(
    file: Express.Multer.File,
    @Body() postDTO: PostDTO,
  ): Promise<ResponseDTO<PostDTO>> {
    this.logger.log('postDTO', postDTO.postTitle);
    // this.logger.log(`Create Post : ${postDTO}`);

    return ResponseUtil.makeSuccessResponse(
      await this.postService.createPost(postDTO),
    );
  }

  /**
   * Post 이미지 저장
   * @param imageUrl
   * @returns
   */
  @Post('/image')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Bind(UploadedFile())
  async saveImage(file: Express.Multer.File): Promise<ResponseDTO<string>> {
    this.logger.log('file', file);
    return ResponseUtil.makeSuccessResponse(
      await this.postService.saveImage(file),
    );
  }

  /**
   * Post 리스트 조회
   * @param board
   * @returns
   */
  @Get('/list')
  async getPostList(
    @Query('board') board: string,
  ): Promise<ResponseDTO<PostDTO[]>> {
    this.logger.log(`Get Post List : ${board}`);
    return ResponseUtil.makeSuccessResponse(
      await this.postService.getPostList(board),
    );
  }

  /**
   * Post 내용 조회
   * @param board, postId
   * @returns
   */
  @Get('/')
  async getPost(
    @Query('board') board: string,
    @Query('postId') postId: number,
  ): Promise<ResponseDTO<PostDTO>> {
    this.logger.log(`Get Post : ${board}, ${postId}`);
    return ResponseUtil.makeSuccessResponse(
      await this.postService.getPost(board, postId),
    );
  }
}
