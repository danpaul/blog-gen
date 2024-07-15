import * as path from "path";
// import * as fs from "fs-extra";
const fs = require("fs-extra");
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGenBase";

export class FileBuildPlugin implements PluginInterface {
  private distRoot: string;
  private contentRoot: string;
  private assetPath: string;

  get assetDistPath() {
    return path.normalize(`${this.distRoot}/${this.assetPath}`);
  }

  get assetSrcPath() {
    return path.normalize(`${this.contentRoot}/${this.assetPath}`);
  }

  constructor({
    distRoot,
    contentRoot,
    assetPath = "assets",
  }: {
    distRoot: string;
    contentRoot: string;
    assetPath?: string;
  }) {
    this.distRoot = distRoot;
    this.contentRoot = contentRoot;
    this.assetPath = assetPath;
  }

  async init(blogGen: BlogGen) {
    blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
    blogGen.addBuildFilter(this.buildFilter.bind(this));
  }

  async preBuildFilter() {
    await this.cleanBuildDir();
  }

  async buildFilter({
    contentItems,
  }: {
    contentItems: ContentItemsInterface[];
  }) {
    await this.buildContent({ contentItems });
    await this.migrateAssets();
  }

  private async cleanBuildDir() {
    await fs.rm(this.distRoot, { recursive: true, force: true });
    await fs.mkdir(this.distRoot);
  }

  private async buildContent({
    contentItems,
  }: {
    contentItems: ContentItemsInterface[];
  }) {
    for (const contentItem of contentItems) {
      await fs.writeFile(
        path.normalize(`${this.distRoot}/${contentItem.pageUrl}`),
        contentItem.$.root().html() || ""
      );
    }
  }

  private async migrateAssets() {
    await fs.ensureDir(this.assetDistPath);
    await fs.copy(this.assetSrcPath, this.assetDistPath);
  }
}
