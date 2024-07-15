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
exports.MarkdownPlugin = void 0;
const fs = __importStar(require("fs/promises"));
const FileMapper_1 = require("./FileMapper");
const ContentItemFilter_1 = require("./ContentItemFilter");
const MenuItemFilter_1 = require("./MenuItemFilter");
class MarkdownPlugin {
    constructor({ contentRoot }) {
        this.contentRoot = contentRoot;
    }
    async init(blogGen) {
        this.blogGen = blogGen;
        this.blogGen.addSourceFilter(this.sourceFilter.bind(this));
        this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
        this.blogGen.addMenuItemsFilter(this.menuFilter.bind(this));
    }
    async sourceFilter(contentItems) {
        const files = await fs.readdir(this.contentRoot, { withFileTypes: true });
        const fileMapper = new FileMapper_1.FileMapper({ files, contentRoot: this.contentRoot });
        return [...contentItems, ...(await fileMapper.mapFiles())];
    }
    async preBuildFilter({ contentItems, }) {
        contentItems.map((contentItem) => (0, ContentItemFilter_1.ContentItemFilter)({ contentItem, options: this.blogGen.siteOptions }));
    }
    async menuFilter({ menuItems, contentItems, }) {
        return (0, MenuItemFilter_1.MenuItemFilter)({ menuItems, contentItems });
    }
}
exports.MarkdownPlugin = MarkdownPlugin;
