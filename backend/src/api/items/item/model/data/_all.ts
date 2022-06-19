import { BOOSTERS } from "src/api/items/alchemy/model/data/boosters";
import { BUBULAE_STEAK, ENCHANTER_POTION, IHON_BERRY, MIGHTY_EXTRACT, MIRACLE_FRUIT, NIMBUS_NECTAR, RAINBOW_MIXTURE, RELIQUM_EGG, RORIS_LEAVES, SPARKING_AMBROSIA, SPIRAL_NUT, TITAN_BREW } from "./food";
import { ARTICHOKE, CRIMSON_SEED, ETERNAL_FLOWER, FEEBLE_MUSHROOMS, FILIKO_ROOTS, GATE_KEY, GATE_PARTICLE, MIDNIGHT_ESSENCE, PALE_GRAINS, SOVAGA_LEAVES, SUPERCHARGED_CRYSTAL, TRANSMUTATION_STONE, SHARD_AGILITY, SHARD_ATTACK, SHARD_BLANK, SHARD_DEFENCE, SHARD_UNITY, SHARD_WISDOM } from "./ingredients";
import { BASE_RUNES } from "./runes";

export const ALL_ITEMS = [
    BUBULAE_STEAK,
    IHON_BERRY,
    SPIRAL_NUT,
    RELIQUM_EGG,
    RORIS_LEAVES,
    MIRACLE_FRUIT,
    MIGHTY_EXTRACT,
    NIMBUS_NECTAR,
    TITAN_BREW,
    ENCHANTER_POTION,
    RAINBOW_MIXTURE,
    SPARKING_AMBROSIA,

    TRANSMUTATION_STONE,
    GATE_PARTICLE,
    GATE_KEY,
    SUPERCHARGED_CRYSTAL,
    ETERNAL_FLOWER,
    MIDNIGHT_ESSENCE,
    PALE_GRAINS,
    FILIKO_ROOTS,
    SOVAGA_LEAVES,
    ARTICHOKE,
    CRIMSON_SEED,
    FEEBLE_MUSHROOMS,

    SHARD_BLANK,
    SHARD_AGILITY,
    SHARD_ATTACK,
    SHARD_DEFENCE,
    SHARD_WISDOM,
    SHARD_UNITY,

    ...BASE_RUNES,

    ...BOOSTERS,
];
