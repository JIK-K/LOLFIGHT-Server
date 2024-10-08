import { Injectable } from '@nestjs/common';
import { Member } from '../entities/member.entity';
import { MemberDTO } from '../DTOs/member.dto';
import { Builder } from 'builder-pattern';

@Injectable()
export class MemberMapper {
  constructor() {
    // empty
  }

  toDTO(memberEntity: Member): MemberDTO {
    const {
      id,
      memberId,
      memberPw,
      memberName,
      memberIcon,
      memberGuild,
      memberGame,
      createdAt,
      updatedAt,
    } = memberEntity;

    return Builder<MemberDTO>()
      .id(id)
      .memberId(memberId)
      .memberPw(memberPw)
      .memberName(memberName)
      .memberIcon(memberIcon)
      .memberGuild(memberGuild)
      .memberGame(memberGame)
      .createdAt(createdAt)
      .updatedAt(updatedAt)
      .build();
  }

  toDTOList(memberEntites: Member[]): MemberDTO[] {
    const memberDTOList = [];
    memberEntites.forEach((memberEntity) =>
      memberDTOList.push(this.toDTO(memberEntity)),
    );

    return memberDTOList;
  }
}
