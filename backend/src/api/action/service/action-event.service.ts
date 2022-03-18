import { Injectable } from "@nestjs/common";
import { DragonActionDto } from "src/api/dragons/dragon-action/model/dto/dragon-action.dto";
import { ExpeditionReportDto } from "src/api/dragons/dragon-action/model/dto/expedition-result.dto";
import { StartExpeditionDto } from "src/api/dragons/dragon-action/model/dto/expedition-start.dto";
import { DragonActionService } from "src/api/dragons/dragon-action/service/dragon-action.service";
import { DragonService } from "src/api/dragons/dragon/service/dragon.service";
import { ItemService } from "src/api/items/item/service/item.service";
import { UserService } from "src/api/users/user/service/user.service";

@Injectable()
export class ActionEventService {

    constructor(
        private userService: UserService,
        private dragonService: DragonService,
        private dragonActionService: DragonActionService,
        private itemService: ItemService,
    ) {}

    async startExpedition(userId: number, dto: StartExpeditionDto): Promise<DragonActionDto> {
        const dragon = await this.dragonService.checkIfEventAvailable(userId, dto.dragonId);

        const action = await this.dragonActionService.startExpedition(dto.expeditionUid, dragon);

        return action;
    }

    async checkExpeditions(userId: number): Promise<ExpeditionReportDto[]> {
        const dragons = await this.dragonService.getOwnedDragons(userId);

        let results: ExpeditionReportDto[] = [];
        for (const dragon of dragons) {
            const expedition = await this.dragonActionService.checkExpedition(dragon);
            if (expedition) {
                const user = await this.userService.getOne(userId);

                const gainedExperience = await this.dragonService.awardExpeditionExperience(dragon, expedition);
                const gainedGold = await this.dragonService.awardExpeditionGold(dragon, expedition);
                const loots = await this.itemService.awardExpeditionItems(user, dragon, expedition);

                await this.userService.updateGold(userId, gainedGold);

                results.push ({
                    dragonName: dragon.name,
                    expeditionName: expedition.name,
                    gainedExperience: gainedExperience,
                    gainedGold: gainedGold,
                    loots: loots,
                });
            }
        }

        return results.filter(result => result != null);
    }
}