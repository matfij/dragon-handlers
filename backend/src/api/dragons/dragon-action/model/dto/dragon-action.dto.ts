import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { DragonActionType } from "../definitions/dragon-action";

export class DragonActionDto {

    @Expose()
    @ApiPropertyOptional()
    id?: number;

    @Expose()
    @ApiProperty({ enum: DragonActionType, enumName: 'DragonActionType' })
    type: DragonActionType;

    @Expose()
    @ApiProperty()
    nextAction: number;
}
