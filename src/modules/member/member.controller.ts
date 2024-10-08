import {
  Body,
  Controller,
  Get,
  Patch,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Delete,
  UseInterceptors,
  Bind,
  UploadedFile,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDTO } from './DTOs/member.dto';
import { ResponseDTO } from 'src/common/DTOs/response.dto';
import { ResponseUtil } from 'src/utils/response.util';
import { CommonUtil } from 'src/utils/common.util';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/configs/multer.config';

@UseGuards(AuthGuard('access'))
@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  private logger: Logger = new Logger();

  /**
   * Member 생성
   * @param memberDTO
   * @returns
   */
  @Post()
  async create(@Body() memberDTO: MemberDTO): Promise<ResponseDTO<MemberDTO>> {
    this.logger.log(`Create Member : ${memberDTO}`);
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.createMember(memberDTO),
    );
  }

  /**
   * Member 로그인
   * @param id
   * @param pw
   * @returns
   */
  @Get('/login')
  async login(
    @Query('id') id: string,
    @Query('pw') pw: string,
  ): Promise<ResponseDTO<MemberDTO>> {
    this.logger.log(`Login Member ID:${id} PW:${pw}`);
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.loginMember(id, pw),
    );
  }

  /**
   * Member id로 찾기
   * @param id
   * @returns
   */
  @Get('/find')
  async find(@Query('id') id: string): Promise<ResponseDTO<MemberDTO>> {
    this.logger.log(`Find Member Id : ${id}`);
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.findMember(id),
    );
  }

  /**
   * Member name로 찾기
   * @param id
   * @returns
   */
  @Get('/findByName')
  async findByName(
    @Query('name') name: string,
  ): Promise<ResponseDTO<MemberDTO>> {
    this.logger.log(`Find Member Name : ${name}`);
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.findMemberByName(name),
    );
  }

  /**
   * Member 길드 탈퇴
   * @param id
   * @returns
   */
  @Patch('/leave')
  async leaveGuild(@Query('id') id: string): Promise<ResponseDTO<MemberDTO>> {
    this.logger.log(`Leave Guild Member ${id}`);
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.leaveMember(id),
    );
  }

  /**
   * Member 업데이트
   * @param memberDTO
   * @returns
   */
  @Patch()
  async update(@Body() memberDTO: MemberDTO): Promise<ResponseDTO<MemberDTO>> {
    this.logger.log(`Update Member ${memberDTO.memberName}`);
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.updateMember(memberDTO),
    );
  }

  /**
   * Member Icon 업데이트
   * @param file
   * @param memberDTO
   * @returns
   */
  @Patch('/icon')
  @UseInterceptors(FileInterceptor('memberIcon', multerConfig))
  @Bind(UploadedFile())
  async updateIcon(
    file: Express.Multer.File,
    @Body() memberDTO: MemberDTO,
  ): Promise<ResponseDTO<MemberDTO>> {
    this.logger.log(`Update Member Icon ${memberDTO.memberName}`);
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.updateMemberIcon(memberDTO, file),
    );
  }

  /**
   * Member 삭제
   * @param id
   * @returns
   */
  @Delete()
  async remove(@Query('id') id: string): Promise<ResponseDTO<MemberDTO>> {
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.deleteMember(id),
    );
  }

  /**
   * Member Guild LOLName으로 찾기
   * @param name
   * @returns
   */
  @Get('/guildName')
  async getGuildName(
    @Query('summonerName') name: string,
  ): Promise<ResponseDTO<string>> {
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.getMemberGuildName(name),
    );
  }

  /**
   * Member LOL계정 삭제
   * @param memberId
   * @returns
   */
  @Patch('/deleteSummoner')
  async deleteSummonerData(
    @Query('memberId') memberId: string,
  ): Promise<ResponseDTO<MemberDTO>> {
    return ResponseUtil.makeSuccessResponse(
      await this.memberService.deleteMemberGame(memberId),
    );
  }
}
