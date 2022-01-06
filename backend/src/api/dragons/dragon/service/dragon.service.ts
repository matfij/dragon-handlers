import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DragonActionService } from '../../dragon-action/service/dragon-action.service';
import { Dragon } from '../model/dragon.entity';
import { AdoptDragonDto } from '../model/dto/adopt-dragon.dto';
import { DragonDto } from '../model/dto/dragon.dto';
import { GetDragonDto } from '../model/dto/get-dragon.dto';
import { PageDragonDto } from '../model/dto/page-dragon.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { FEED_INTERVAL, GET_ALL_RELATIONS, GET_ONE_RELATIONS } from 'src/configuration/dragon.config';
import { DateService } from 'src/common/services/date.service';
import { ItemDto } from 'src/api/items/item/model/dto/item.dto';
import { FoodType } from 'src/api/items/item/model/definitions/item-type';
import { CreateDragonDto } from '../model/dto/create-dragon.dto';
import { ErrorService } from 'src/common/services/error.service';

@Injectable()
export class DragonService {

    constructor(
        @InjectRepository(Dragon)
        private dragonRepository: Repository<Dragon>,
        private dragonActionService: DragonActionService,
        private errorService: ErrorService,
        private dateService: DateService,
    ) {}

    async create(dto: CreateDragonDto): Promise<DragonDto> {
        const dragon = this.dragonRepository.create({ ...dto });
        dragon.action = await this.dragonActionService.create();
        const savedDragon = await this.dragonRepository.save(dragon);

        return savedDragon;
    }

    async getOne(id: string): Promise<DragonDto> {
        return this.dragonRepository.findOne(id, { relations: GET_ONE_RELATIONS });
    }

    async getAll(dto: GetDragonDto): Promise<PageDragonDto> {
        const page = await paginate<DragonDto>(
            this.dragonRepository, 
            { page: dto.page, limit: dto.limit }, 
            { relations: GET_ALL_RELATIONS },
        );

        const dragonPage: PageDragonDto = {
            data: page.items.filter(x => x.ownerId === dto.ownerId),
            meta: page.meta,
        };
        return dragonPage;
    }

    async adopt(ownerId: number, dto: AdoptDragonDto): Promise<DragonDto> {
        const dragon = this.dragonRepository.create({ ...dto, ownerId: ownerId });
        dragon.action = await this.dragonActionService.create();
        const savedDragon = await this.dragonRepository.save(dragon);

        return savedDragon;
    }

    async getOwnedDragons(ownerId: number): Promise<DragonDto[]> {
        const dragons = this.dragonRepository
            .createQueryBuilder('dragon')
            .leftJoinAndSelect('dragon.action', 'action')
            .where('dragon.ownerId = :ownerId')
            .setParameters({ ownerId: ownerId })
            .getMany()
        return await dragons;
    }

    async checkDragon(ownerId: number, dragonId: number): Promise<DragonDto> {
        const dragon = await this.dragonRepository.findOne(dragonId, { relations: GET_ALL_RELATIONS });

        if (!dragon) this.errorService.throw('errors.dragonNotFound');
        if (dragon.ownerId !== ownerId) this.errorService.throw('errors.dragonNotFound');

        return dragon;
    }

    async checkFeedingDragon(ownerId: number, dragonId: number): Promise<DragonDto> {
        const dragon = await this.checkDragon(ownerId, dragonId);

        if (!this.dateService.checkIfEventAvailable(dragon.nextFeed)) this.errorService.throw('errors.dragonAlreadyFed');

        return dragon;
    }

    async feedDragon(item: ItemDto, dragon: DragonDto): Promise<DragonDto> {
        switch(item.foodType) {
            case FoodType.Strength: { dragon.strength += 1; break; }
            case FoodType.Dexterity: { dragon.dexterity += 1; break; }
            case FoodType.Endurance: { dragon.endurance += 1; break; }
            case FoodType.Will: { dragon.will += 1; break; }
            case FoodType.Luck: { dragon.luck += 1; break; }
            case FoodType.Special: { 
                dragon.strength += 1; 
                dragon.dexterity += 1; 
                dragon.endurance += 1; 
                dragon.will += 1; 
                dragon.luck += 1; 
                break; 
            }
        };
        dragon.level += 1;
        dragon.nextFeed = Date.now() + FEED_INTERVAL;

        const fedDragon = await this.dragonRepository.save(dragon);
        return fedDragon;
    }

    async checkIfEventAvailable(ownerId: number, dragonId: number): Promise<DragonDto> {
        const dragon = await this.checkDragon(ownerId, dragonId);

        if (!this.dateService.checkIfEventAvailable(dragon.action.nextAction)) this.errorService.throw('errors.dragonBusy');

        return dragon;
    }

}
