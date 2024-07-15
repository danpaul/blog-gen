import * as fs from "fs/promises";

import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGenBase";
import { FileMapper } from "./FileMapper";
import { ContentItemFilter } from "./ContentItemFilter";
import { MenuItemInterface } from "../../BlogGen/TypesInterfaces/Data/MenuItemInterface";
import { MenuItemFilter } from "./MenuItemFilter";

export class MarkdownPlugin implements PluginInterface {
  private contentRoot: string;
  // @ts-ignore
  private blogGen: BlogGen;

  public constructor({ contentRoot }: { contentRoot: string }) {
    this.contentRoot = contentRoot;
  }

  async init(blogGen: BlogGen) {
    this.blogGen = blogGen;
    this.blogGen.addSourceFilter(this.sourceFilter.bind(this));
    this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
    this.blogGen.addMenuItemsFilter(this.menuFilter.bind(this));
  }

  async sourceFilter(
    contentItems: ContentItemsInterface[]
  ): Promise<ContentItemsInterface[]> {
    const files = await fs.readdir(this.contentRoot, { withFileTypes: true });
    const fileMapper = new FileMapper({ files, contentRoot: this.contentRoot });
    return [...contentItems, ...(await fileMapper.mapFiles())];
  }

  async preBuildFilter({
    contentItems,
  }: {
    contentItems: ContentItemsInterface[];
  }): Promise<void> {
    contentItems.map((contentItem) =>
      ContentItemFilter({ contentItem, options: this.blogGen.siteOptions })
    );
  }

  async menuFilter({
    menuItems,
    contentItems,
  }: {
    menuItems: MenuItemInterface[];
    contentItems: ContentItemsInterface[];
  }) {
    return MenuItemFilter({ menuItems, contentItems });
  }
}
