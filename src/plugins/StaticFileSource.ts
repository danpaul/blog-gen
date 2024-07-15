// import * as fs from "fs/promises";
const fs = require("fs/promises");

import { ContentItemsInterface } from "../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import SourcePluginInterface from "../BlogGen/TypesInterfaces/Plugins/SourcePluginInterface";
import { Dirent } from "fs-extra";
import path from "path";

export default class StaticFileSource implements SourcePluginInterface {
  private contentRoot: string;

  constructor({ contentRoot }: { contentRoot: string }) {
    this.contentRoot = contentRoot;
  }

  async getItems(contentItems: ContentItemsInterface[]) {
    let files = (
      await fs.readdir(this.contentRoot, { withFileTypes: true })
    ).filter((f) => this.isMarkdownFile(f) && this.isPublicFile(f));

    return [
      ...contentItems,
      // files
    ];
  }

  private isMarkdownFile(f: Dirent) {
    return f.isFile() && path.extname(f.name).toLowerCase() == ".md";
  }

  private isPublicFile(f: Dirent) {
    return f.name[0] && f.name[0] !== "_";
  }
}
