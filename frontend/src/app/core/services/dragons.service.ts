import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DragonActionDto, DragonActionType, DragonDto, DragonNature, DragonPublicDto, ExpeditionGuardianDto, SkillDto } from "src/app/client/api";
import { DateService } from "src/app/common/services/date.service";
import { DisplayDragon, DisplayDragonPublic, DisplaySkill } from "../definitions/dragons";

@Injectable({
  providedIn: 'root'
})
export class DragonService {

  private readonly BASE_IMG_PATH = 'assets/img/dragons';
  private readonly BASE_SKILL_IMG_PATH = 'assets/img/skills';
  private readonly VERSION = 1;
  private readonly EXTENSION = 'png';

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
  ) {}

  getDragonAge(level: number): number {
    let age: number;
    if (level < 10) age = 1;
    else if (level < 45) age = 2;
    else if (level < 100) age = 3;
    else age = 4;

    return age;
  }

  toDisplayDragon(dragon: DragonDto): DisplayDragon {
    let nature = dragon.nature.toLowerCase();
    const age = this.getDragonAge(dragon.level);

    const image = `${this.BASE_IMG_PATH}/${nature}-${this.VERSION}-${age}.${this.EXTENSION}`;

    const currentAction = (dragon.action && dragon.action.type !== DragonActionType.None && !this.dateService.checkIfEventAvailable(dragon.action.nextAction))
      ? this.getDragonActionName(dragon.action.type)
      : undefined;

    return {
      ...dragon,
      image: image,
      currentAction: currentAction,
    };
  }

  toDisplayDragonPublic(dragon: DragonPublicDto): DisplayDragonPublic {
    let nature = dragon.nature.toLowerCase();
    const age = this.getDragonAge(dragon.level);

    const image = `${this.BASE_IMG_PATH}/${nature}-${this.VERSION}-${age}.${this.EXTENSION}`;

    return {
      ...dragon,
      image: image,
    };
  }

  toDisplayGuardian(guardian: ExpeditionGuardianDto): DisplayDragon {
    const dragon: DragonDto = {
      name: guardian.name,
      level: guardian.level,
      skills: guardian.skills,
      boosterUid: guardian.boosterUid,
      strength: guardian.strength,
      dexterity: guardian.dexterity,
      endurance: guardian.endurance,
      will: guardian.will,
      luck: guardian.luck,
      id: null as any,
      experience: null as any,
      skillPoints: null as any,
      runes: null as any,
      unlockedExpeditions: null as any,
      nextFeed: null as any,
      stamina: null as any,
      booster: null as any,
      nature: null as any,
      battledWith: null as any,
      action: null as any,
    };

    const image = `assets/img/expeditions/${guardian.uid}.${this.EXTENSION}`;

    return {
      ...dragon,
      image: image,
    }
  }

  getDragonActionName(type: DragonActionType): string {
    let name;
    switch(type) {
      case DragonActionType.None: { name = 'dragon.actionNone'; break; }
      case DragonActionType.Expedition: { name = 'dragon.actionExpedition'; break; }
      case DragonActionType.Training: { name = 'dragon.actionTraining'; break; }
    }
    return this.translateService.instant(name);
  }

  toDisplaySkill(skill: SkillDto): DisplaySkill {
    const image = `${this.BASE_SKILL_IMG_PATH}/${skill.uid}.svg`;

    return {
      ...skill,
      image: image,
    };
  }

}
