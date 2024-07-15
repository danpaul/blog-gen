import * as fs from "fs-extra";
import * as path from "path";
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
export class GithubMarkdownStylePlugin {
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
