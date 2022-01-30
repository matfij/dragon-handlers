import { ApiPropertyOptional } from "@nestjs/swagger";
import { DragonNature } from "src/api/dragons/dragon/model/definitions/dragon-nature";

export class GetSkillsDto {

    @ApiPropertyOptional()
    minLevel?: number;

    @ApiPropertyOptional()
    maxLevel?: number;

    @ApiPropertyOptional()
    requiredNature?: DragonNature;
}
