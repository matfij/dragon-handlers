import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MathService } from "src/common/services/math.service";
import { Repository } from "typeorm";
import { BattleDragon, TurnResult } from "../model/definitions/dragon-battle";
import { Dragon } from "../model/dragon.entity";
import { BattleResultDto } from "../model/dto/battle-result.dto";
import { DragonDto } from "../model/dto/dragon.dto";
import { BattleHelperService } from "./dragon-helper.service";

@Injectable()
export class DragonBattleService {

    constructor (
        @InjectRepository(Dragon)
        private dragonRepository: Repository<Dragon>,
        private battleHelperService: BattleHelperService,
        private mathService: MathService,
    ) {}

    async executeBattle(ownedDragon: DragonDto, enemyDragon: DragonDto): Promise<Partial<BattleResultDto>> {
        let owned = this.battleHelperService.calculateBattleStats(ownedDragon, enemyDragon);
        let enemy = this.battleHelperService.calculateBattleStats(enemyDragon, ownedDragon);

        const logs = [];
        let result = '';

        while (owned.health > 0 && enemy.health > 0 && logs.length <= 100) {
            let turnResult: TurnResult;

            if (owned.initiative > enemy.initiative) {
                turnResult = this.performMovement(owned, enemy, true, logs.length);
                owned = turnResult.attacker;
                enemy = turnResult.defender;
            } else {
                turnResult = this.performMovement(enemy, owned, false, logs.length);
                owned = turnResult.defender;
                enemy = turnResult.attacker;
            }
            logs.push(turnResult.log);
        }

        if (logs.length >= 100) {
            result =`<div class="neither">The battle did not found a winner.</div>`;
        } else if (owned.health > enemy.health) {
            owned = await this.saveBattleResults(true, owned, enemy, logs.length);
            const gainedExperience = owned.experience - ownedDragon.experience;
            result = `<div class="owned">${owned.name} won and gained ${gainedExperience} experience.</div>`;
        } else {
            owned = await this.saveBattleResults(false, owned, enemy, logs.length);
            result =`<div class="enemy">${enemy.name} won.</div>`;
        }

        return {
            ownedDragon: { id: owned.id, name: owned.name, level: owned.level, stamina: owned.stamina, },
            enemyDragon: { id: enemy.id, name: enemy.name, level: enemy.level, },
            logs: logs,
            result: result,
        };
    }

    private performMovement(attacker: BattleDragon, defender: BattleDragon, ownedTurn: boolean, turn: number): TurnResult {
        let cssClasses = ownedTurn ? 'item-log log-owned' : 'item-log log-enemy';
        let independentLogs = [];
        let extraLogs = [];
        let isCrit = false;

        /**
         * Preamptive restore effects
         */
        defender.mana += defender.skills.innerFlow;
        defender.initiative += defender.speed;

        /**
         * Dodge chance
         */
        const hitChance = 0.5 + Math.random();  // 0.5 - 1.5
        if (defender.dodgeChance > hitChance) {
            const log = `
                <div class="${cssClasses}">
                    ${attacker.name} (${attacker.health.toFixed(1)}) 
                    missess.
                </div>`;

            return { attacker: attacker, defender: defender, log: log };
        }

        /**
         * Critical chance
         */
        const nocritChance = 0.5 + Math.random();  // 0.5 - 1.5
        if (attacker.critChance > nocritChance) {
            isCrit = true;
            cssClasses += ' log-crit';
        }

        /**
         * Regular hit
         */
        let baseHit = isCrit 
            ? this.mathService.randRange(0.9, 1.1) * attacker.critPower * attacker.damage - defender.armor 
            : this.mathService.randRange(0.9, 1.1) * attacker.damage - defender.armor;
        baseHit = this.mathService.limit((1 + attacker.level/10) * Math.random(), baseHit, baseHit);
        defender.health -= baseHit;

        /**
         * Offensive effects
         */
        if (attacker.skills.fireBreath > 0) {
            const baseFireComponent = (1 + attacker.skills.fireBreath / 40) * attacker.will;
            let fireHit = isCrit 
                ? this.mathService.randRange(0.9, 1.1) * attacker.critPower * baseFireComponent - (0.5 * defender.armor + 0.5 * defender.will)
                : this.mathService.randRange(0.9, 1.1) * baseFireComponent - (0.5 * defender.armor + 0.5 * defender.will);
            fireHit = this.mathService.limit(attacker.skills.fireBreath * Math.random(), fireHit, fireHit);
            defender.health -= fireHit;
            extraLogs.push(`<div class="log-extra">+ ${fireHit.toFixed(1)} fire damage</div>`);
        }
        
        if (attacker.skills.pugnaciousStrike > 0 && defender.armor > 0) {
            const armorBreak = (1 + attacker.dexterity / 10) * attacker.skills.pugnaciousStrike / 2;
            defender.armor -= armorBreak;
            extraLogs.push(`<div class="log-extra">+ broken ${armorBreak.toFixed(1)} armor</div>`);
        }
        
        /**
         * Defensive skills
         */

        if (defender.skills.roughSkin > 0) {
            const reflectedHit = baseHit * defender.skills.roughSkin / 60;
            attacker.health -= reflectedHit;
            extraLogs.push(`<div class="log-extra">- ${defender.name} reflected ${reflectedHit.toFixed(1)} damage</div>`);
        }

        let log = `
            <div class="${cssClasses}">
                ${attacker.name} (${attacker.health.toFixed(1)}) 
                ${isCrit ? 'critically strikes' : 'strikes'} 
                ${defender.name} (${defender.health.toFixed(1)}) 
                for ${baseHit.toFixed(1)}`;
        extraLogs.forEach(extraLog => log += extraLog);
        log += `</div>`;

        /**
         * Post-movement effects
         */
        if (defender.skills.soundBody > 0 && defender.health < defender.maxHealth && defender.health > 0) {
            let restoredHealth = 0.05 * defender.maxHealth * (1 + defender.skills.soundBody / (20 + 1.25 * turn));
            if (restoredHealth > 0) {
                defender.health += restoredHealth;
                if (defender.health > defender.maxHealth) defender.health = defender.maxHealth;
                independentLogs.push(`<div class="item-log log-status">${defender.name} restored ${restoredHealth.toFixed(1)} health.</div>`);
            } 
        }

        independentLogs.forEach(independentLog => log += independentLog);

        return { attacker: attacker, defender: defender, log: log };
    }

    private async saveBattleResults(ownedWin: boolean, owned: BattleDragon, enemy: BattleDragon, battleLength: number): Promise<BattleDragon> {
        if (ownedWin) {
            let gainedExperience = 10 * this.mathService.randRange(0.7, 1.3) 
                * Math.log(1 + Math.max(1, (enemy.level - owned.level)));
            gainedExperience = Math.round(this.mathService.limit(1, gainedExperience, 100));

            owned.experience += gainedExperience;
        }

        owned.stamina -= 1 + Math.floor(battleLength / 10);
        if (owned.stamina < 0) owned.stamina = 0;

        await this.dragonRepository.update(owned.id, { experience: owned.experience, stamina: owned.stamina });
        return owned;
    }
}
