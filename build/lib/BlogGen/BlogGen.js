"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlogPlugin_1 = require("../plugins/BlogPlugin/BlogPlugin");
const FileBuildPlugin_1 = require("../plugins/FileBuildPlugin/FileBuildPlugin");
const GithubMarkdownStylePlugin_1 = require("../plugins/GithubMarkdownStylePlugin/GithubMarkdownStylePlugin");
const MarkdownPlugin_js_1 = require("../plugins/MarkdownPlugin/MarkdownPlugin.js");
const MenuPlugin_js_1 = require("../plugins/MenuPlugin/MenuPlugin.js");
const BlogGenBase_js_1 = __importDefault(require("./BlogGenBase.js"));
class BlogGen extends BlogGenBase_js_1.default {
    constructor(options) {
        super(options.site);
        const { contentRoot, distRoot, itemsPerPage } = options.build;
        this.addPlugin(new MarkdownPlugin_js_1.MarkdownPlugin({ contentRoot }));
        this.addPlugin(new MenuPlugin_js_1.MenuPlugin());
        this.addPlugin(new GithubMarkdownStylePlugin_1.GithubMarkdownStylePlugin({
            distRoot,
        }));
        this.addPlugin(new BlogPlugin_1.BlogPlugin({
            itemsPerPage,
        }));
        this.addPlugin(new FileBuildPlugin_1.FileBuildPlugin({ distRoot, contentRoot }));
    }
}
exports.default = BlogGen;
