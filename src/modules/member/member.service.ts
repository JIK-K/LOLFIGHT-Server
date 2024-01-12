import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MemberMapper } from './mapper/member.mapper';
import { Repository } from 'typeorm';
import { MemberDTO } from './DTOs/member.dto';
import * as bcrypt from 'bcrypt';
import { ResponseDTO } from 'src/common/DTOs/response.dto';
import { Builder } from 'builder-pattern';
import { CommonUtil } from 'src/utils/common.util';
import { CODE_CONSTANT } from 'src/common/constants/common-code.constant';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private memberMapper: MemberMapper,
  ) {}

  /**
   * Member생성
   * @param memberDTO
   * @returns
   */
  async createMember(memberDTO: MemberDTO): Promise<MemberDTO> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(memberDTO.memberPw, salt);
    // console.log(memberDTO);

    const existMemberData = await this.memberRepository
      .createQueryBuilder('member')
      .where('memberId = :id', {
        id: memberDTO.memberId,
      })
      .getOne();

    // console.log(existMemberData);

    if (existMemberData) {
      throw new HttpException(CODE_CONSTANT.EXIST_DATA, HttpStatus.BAD_REQUEST);
    }

    const memberEntity: Member = Builder<Member>()
      .id(memberDTO.id)
      .memberId(memberDTO.memberId)
      .memberPw(hashedPassword)
      .memberName(memberDTO.memberName)
      .memberPhone(memberDTO.memberPhone)
      .memberBirthDay(memberDTO.memberBirthDay)
      .memberGuild(memberDTO.memberGuild)
      .salt(salt)
      .build();

    return this.memberMapper.toDTO(
      await this.memberRepository.save(memberEntity),
    );
  }

  /**
   * Member 로그인
   * @param id
   * @param pw
   * @returns
   */
  async loginMember(id: string, pw: string): Promise<MemberDTO> {
    if (!CommonUtil.isValid(id)) {
      throw new HttpException(
        CODE_CONSTANT.NO_REQUIRED_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!CommonUtil.isValid(pw)) {
      throw new HttpException(
        CODE_CONSTANT.NO_REQUIRED_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }

    const memberEntity: Member = await this.memberRepository
      .createQueryBuilder('member')
      .where('memberId = :id', {
        id: id,
      })
      .getOne();

    if (!CommonUtil.isValid(memberEntity)) {
      throw new HttpException(CODE_CONSTANT.NO_DATA, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(pw, memberEntity.salt);
    if (hashedPassword === memberEntity.memberPw) {
      return this.memberMapper.toDTO(memberEntity);
    }
  }
}
