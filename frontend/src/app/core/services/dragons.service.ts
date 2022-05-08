import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DragonActionType, DragonDto, DragonNature, SkillDto } from "src/app/client/api";
import { DateService } from "src/app/common/services/date.service";
import { DisplayDragon, DisplaySkill } from "../definitions/dragons";

@Injectable({
  providedIn: 'root'
})
export class DragonService {

  private readonly BASE_IMG_PATH = 'assets/img/dragons';
  private readonly BASE_SKILL_IMG_PATH = 'assets/img/skills';
  private readonly EXTENSION = 'png';

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
  ) {}

  toDisplayDragon(dragon: DragonDto): DisplayDragon {
    let nature: string;
    switch (dragon.nature) {
      case DragonNature.Fire: { nature = 'fire'; break; }
      case DragonNature.Water: { nature = 'water'; break; }
      case DragonNature.Wind: { nature = 'wind'; break; }
      case DragonNature.Earth: { nature = 'earth'; break; }
      case DragonNature.Electric: { nature = 'electric'; break; }
      case DragonNature.Nature: { nature = 'nature'; break; }
      case DragonNature.Dark: { nature = 'dark'; break; }
    };

    let adulthood: number;
    if (dragon.level < 10) adulthood = 1;
    else if (dragon.level < 45) adulthood = 2;
    else if (dragon.level < 100) adulthood = 3;
    else adulthood = 4;

    const image = `${this.BASE_IMG_PATH}/${nature}-1-${adulthood}.${this.EXTENSION}`;

    const currentAction = (dragon.action && dragon.action.type !== DragonActionType.None && !this.dateService.checkIfEventAvailable(dragon.action.nextAction))
      ? this.getDragonActionName(dragon.action.type)
      : undefined;

    return {
      ...dragon,
      image: image,
      currentAction: currentAction,
    };
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
