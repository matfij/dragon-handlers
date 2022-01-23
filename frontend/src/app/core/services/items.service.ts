import { Injectable } from "@angular/core";
import { ItemDto } from "src/app/client/api";
import { DisplayItem } from "../definitions/items";

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private readonly BASE_NAME_PATH = 'items';
  private readonly BASE_RARITY_PATH = 'enums.itemRarity';
  private readonly BASE_TYPE_PATH = 'enums.itemType';
  private readonly BASE_IMG_PATH = 'assets/img/items';
  private readonly EXTENSION = 'png';

  toDisplayItem(item: ItemDto): DisplayItem {
    const name = this.getItemName(item.name);
    const rarity = `${this.BASE_RARITY_PATH}.${item.rarity}`;
    const type = `${this.BASE_TYPE_PATH}.${item.type}`;
    const image = `${this.BASE_IMG_PATH}/${item.name}.${this.EXTENSION}`;

    return {
      ...item,
      displayName: name,
      rarityName: rarity,
      typeName: type,
      image: image,
    };
  }

  getItemName(rawName: string): string {
    return `${this.BASE_NAME_PATH}.${rawName}`;
  }
}
