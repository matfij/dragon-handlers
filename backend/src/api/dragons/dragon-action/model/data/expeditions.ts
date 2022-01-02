import { BUBULAE_STEAK, IHON_BERRY, RELIQUM_EGG, RORIS_LEEFS, SPIRAL_NUT } from "src/api/items/item/model/data/food";
import { ExpeditionDto } from "../dto/expedition.dto";

export const ANDREW_FOREST: ExpeditionDto = {
    name: 'AndrewForest',
    level: 1,
    loots: [
        BUBULAE_STEAK,
        IHON_BERRY,
        RELIQUM_EGG,
        SPIRAL_NUT,
        RORIS_LEEFS,
    ],
    minimumActionTime: 3 * 60 * 60 * 1000
}

export const CARRANGA_SANDS: ExpeditionDto = {
    name: 'RangaSands',
    level: 10,
    loots: [
        BUBULAE_STEAK,
        IHON_BERRY,
        RELIQUM_EGG,
        SPIRAL_NUT,
        RORIS_LEEFS,
    ],
    minimumActionTime: 6 * 60 * 60 * 1000
}

export const HARNA_PEAKS: ExpeditionDto = {
    name: 'HarnaPeaks',
    level: 25,
    loots: [
        BUBULAE_STEAK,
        IHON_BERRY,
        RELIQUM_EGG,
        SPIRAL_NUT,
        RORIS_LEEFS,
    ],
    minimumActionTime: 12 * 60 * 60 * 1000
}