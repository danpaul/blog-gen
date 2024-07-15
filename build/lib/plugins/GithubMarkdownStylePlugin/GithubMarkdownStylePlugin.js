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
exports.GithubMarkdownStylePlugin = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const FILE_NAME = "assets/css/github-markdown.css";
const SOURCE_FILE_PATH = "./node_modules/github-markdown-css/github-markdown.css";
const BASE_STYLES = `
  <style>
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }

    @media (max-width: 767px) {
      .markdown-body {
        padding: 15px;
      }
    }
  </style>
`;
class GithubMarkdownStylePlugin {
    constructor({ distRoot }) {
        this.distRoot = distRoot;
    }
    async init(blogGen) {
        this.blogGen = blogGen;
        this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
        this.blogGen.addBuildFilter(this.buildFilter.bind(this));
    }
    async preBuildFilter({ contentItems, }) {
        contentItems.forEach(({ $ }) => {
            $("head").append(`<link rel="stylesheet" href="${FILE_NAME}">`);
            const body = $("body");
            $("head").append(BASE_STYLES);
            $("body").replaceWith(`<main class="markdown-body">${body}</main>`);
        });
    }
    async buildFilter() {
        await fs.copy(path.normalize(SOURCE_FILE_PATH), path.normalize(`${this.distRoot}/${FILE_NAME}`));
    }
}
exports.GithubMarkdownStylePlugin = GithubMarkdownStylePlugin;
