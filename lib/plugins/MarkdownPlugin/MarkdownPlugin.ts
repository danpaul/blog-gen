import * as fs from "fs/promises";

import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGen";
import { FileMapper } from "./FileMapper";

export class MarkdownPlugin implements PluginInterface {
  private contentRoot: string;
  private blogGen: BlogGen;

  public constructor({ contentRoot }: { contentRoot: string }) {
    this.contentRoot = contentRoot;
  }

  async init(blogGen: BlogGen) {
    this.blogGen = blogGen;
    this.blogGen.addSourceFilter(this.sourceFilter.bind(this));
  }

  async sourceFilter(contentItems: ContentItemsInterface[]) {
    const files = await fs.readdir(this.contentRoot, { withFileTypes: true });
    const fileMapper = new FileMapper({ files, contentRoot: this.contentRoot });
    return [...contentItems, ...(await fileMapper.mapFiles())];
  }
}
