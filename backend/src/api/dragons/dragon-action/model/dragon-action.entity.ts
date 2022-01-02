import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DragonActionType } from "./definitions/dragon-action";

@Entity()
export class DragonAction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: DragonActionType.None })
    type: DragonActionType;

    @Column({ default: 0, type: 'int8' })
    nextAction: number;
}
