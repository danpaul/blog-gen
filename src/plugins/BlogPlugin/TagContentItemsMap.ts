/**
 * - label
 * - items
 * - children
 */

import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";

export type Map = {
  [key: string]: ContentItemsInterface[];
};

export class TagContentItemsMap {
  public readonly map: Map;

  constructor({ contentItems }: { contentItems: ContentItemsInterface[] }) {
    this.map = {};
    this.init({ contentItems });
  }

  private init({ contentItems }: { contentItems: ContentItemsInterface[] }) {
    contentItems.forEach((contentItem) => {
      const tags = contentItem?.meta?.tags;
      if (tags?.length) {
        // @ts-ignore
        tags.forEach((tag) => {
          if (typeof tag === "string") {
            if (!this.map[tag]) {
              this.map[tag] = [];
            }
            this.map[tag].push(contentItem);
          }
        });
      }
    });
    // TODO - sort tags by number
  }
}
