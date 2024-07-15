import * as path from "path";
import * as fs from "fs-extra";
export class FileBuildPlugin {
    get assetDistPath() {
        return path.normalize(`${this.distRoot}/${this.assetPath}`);
    }
    get assetSrcPath() {
        return path.normalize(`${this.contentRoot}/${this.assetPath}`);
    }
    constructor({ distRoot, contentRoot, assetPath = "assets", }) {
        this.distRoot = distRoot;
        this.contentRoot = contentRoot;
        this.assetPath = assetPath;
    }
    async init(blogGen) {
        blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
        blogGen.addBuildFilter(this.buildFilter.bind(this));
    }
    async preBuildFilter() {
        await this.cleanBuildDir();
    }
    async buildFilter({ contentItems, }) {
        await this.buildContent({ contentItems });
        await this.migrateAssets();
    }
    async cleanBuildDir() {
        await fs.rm(this.distRoot, { recursive: true, force: true });
        await fs.mkdir(this.distRoot);
    }
    async buildContent({ contentItems, }) {
        for (const contentItem of contentItems) {
            await fs.writeFile(path.normalize(`${this.distRoot}/${contentItem.pageUrl}`), contentItem.$.root().html());
        }
    }
    async migrateAssets() {
        await fs.ensureDir(this.assetDistPath);
        await fs.copy(this.assetSrcPath, this.assetDistPath);
    }
}
