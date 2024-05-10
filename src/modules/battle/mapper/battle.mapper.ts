import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { Battle } from '../entities/battle.entity';
import { BattleDTO } from '../DTOs/battle.dto';

@Injectable()
export class BattleMapper {
  constructor() {}

  toDTO(battleEntity: Battle): BattleDTO {
    const { id, battleId, battleMode, battleLength, teamA, teamB } =
      battleEntity;

    return Builder<BattleDTO>()
      .id(id)
      .battleId(battleId)
      .battleMode(battleMode)
      .battleLength(battleLength)
      .teamA(teamA)
      .teamB(teamB)
      .build();
  }
}