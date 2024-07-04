import * as path from "path";
import * as fs from "fs-extra";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGen";

export class FileBuildPlugin implements PluginInterface {
  private distRoot: string;

  constructor({ distRoot }: { distRoot: string }) {
    this.distRoot = distRoot;
  }

  async init(blogGen: BlogGen) {
    blogGen.addBuildFilter(this.buildFilter.bind(this));
  }

  async buildFilter({
    contentItems,
  }: {
    contentItems: ContentItemsInterface[];
  }) {
    for (const contentItem of contentItems) {
      // console.log("building:", contentItem.pageUrl);
      // asdf
      await fs.writeFile(
        path.normalize(`${this.distRoot}/${contentItem.pageUrl}`),
        contentItem.$.root().html()
      );
    }
  }
}
