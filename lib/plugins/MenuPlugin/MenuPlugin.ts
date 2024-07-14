import * as fs from "fs/promises";

import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGenBase";
import { MenuItemInterface } from "../../BlogGen/TypesInterfaces/Data/MenuItemInterface";
import { InjectMenu } from "./InjectMenu";

export class MenuPlugin implements PluginInterface {
  private blogGen: BlogGen;

  async init(blogGen: BlogGen) {
    this.blogGen = blogGen;
    this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
  }

  async preBuildFilter({
    menuItems,
    contentItems,
  }: {
    menuItems: MenuItemInterface[];
    contentItems: ContentItemsInterface[];
  }) {
    return new InjectMenu({
      menuItems,
      contentItems,
      options: this.blogGen.siteOptions,
    }).inject();
  }
}
