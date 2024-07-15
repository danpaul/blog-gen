"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBuildPlugin = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
class FileBuildPlugin {
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
exports.FileBuildPlugin = FileBuildPlugin;
