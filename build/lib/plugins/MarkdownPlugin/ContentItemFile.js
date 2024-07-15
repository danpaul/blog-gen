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
exports.ContentItemFile = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const cheerio = __importStar(require("cheerio"));
const yaml = require("js-yaml");
const showdown = require("showdown");
const converter = new showdown.Converter({ metadata: true });
class ContentItemFile {
    constructor({ file, contentRoot }) {
        // TODO: cleanup!!!
        return (async () => {
            const { name } = file;
            const isPage = name.substring(0, 4).toLowerCase() == "page";
            const cutFileName = isPage ? name.substring(5) : name;
            const unCutFileNameWithoutExtension = cutFileName.substring(0, cutFileName.length - 3);
            const cutFileNameWithoutExtension = cutFileName.substring(11, cutFileName.length - 3);
            const dateString = cutFileName.substring(0, 10);
            const title = cutFileNameWithoutExtension.replaceAll("_", " ");
            const filePath = path.normalize(contentRoot + "/" + name);
            const fileString = await fs.readFile(filePath, "utf-8");
            const fileMarkup = converter.makeHtml(fileString);
            const $ = cheerio.load(fileMarkup);
            // add header
            $("body").prepend(`
        <header>
          <h1>${title}</h1>
          <h6>Published: ${dateString}</h6>
        </header>
      `);
            const metadata = yaml.load(converter.getMetadata(true)) || {};
            const excerpt = $("p").first().text() || "";
            const firstImage = $("img").first();
            const featuredImage = firstImage &&
                firstImage.attr("src") &&
                firstImage.attr("src").indexOf("assets") == 0
                ? {
                    src: firstImage.attr("src"),
                    alt: firstImage.attr("alt") || "",
                }
                : null;
            const relativeUrlPath = (isPage ? cutFileNameWithoutExtension : unCutFileNameWithoutExtension)
                .toLocaleLowerCase()
                .replaceAll("_", "-") + ".html";
            this.title = title;
            this.type = isPage ? "page" : "post";
            this.published = new Date(dateString);
            this.$ = $;
            this.excerpt = excerpt;
            this.featuredImage = featuredImage;
            this.pageUrl = relativeUrlPath;
            this.meta = metadata;
            return this;
        })();
    }
}
exports.ContentItemFile = ContentItemFile;
