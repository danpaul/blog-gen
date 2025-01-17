import * as fs from "fs/promises";

import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGenBase";
import { MenuItemInterface } from "../../BlogGen/TypesInterfaces/Data/MenuItemInterface";

export class SortPlugin implements PluginInterface {
  // @ts-ignore
  private blogGen: BlogGen;

  async init(blogGen: BlogGen) {
    this.blogGen = blogGen;
    this.blogGen.addContentItemsFilter(this.sortFilter.bind(this));
  }

  async sortFilter(contentItems: ContentItemsInterface[]) {
    return contentItems.sort((a, b) => {
      return (
        (b.published ? b.published.getTime() : 0) -
        (a.published ? a.published.getTime() : 0)
      );
    });
  }
}
