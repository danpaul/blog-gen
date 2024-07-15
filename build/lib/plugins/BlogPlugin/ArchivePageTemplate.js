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
exports.ArchivePageTemplate = void 0;
const cheerio = __importStar(require("cheerio"));
class ArchivePageTemplate {
    constructor({ previousPageUrl, nextPageUrl, items, categoryLinks, }) {
        this.previousPageUrl = previousPageUrl;
        this.nextPageUrl = nextPageUrl;
        this.items = items;
        this.categoryLinks = categoryLinks;
    }
    render() {
        const $ = cheerio.load("");
        const body = $("body");
        if (this.categoryLinks.length) {
            body.append(`<h1 style="padding-bottom: 60px;">Category: </h1>`);
            const h1 = $("body h1");
            this.categoryLinks.forEach(({ label, url }, index) => {
                h1.append(`<a href="${url}">${label}</a>`);
                if (index < this.categoryLinks.length - 1) {
                    h1.append(" / ");
                }
            });
        }
        this.items.forEach(({ title, featuredImage, excerpt, pageUrl, $ }) => {
            let header = `<h2><a href="${pageUrl}">${title}<a/></h2>`;
            const clonedHeader = cheerio.load($("body header").toString());
            if (clonedHeader) {
                clonedHeader("h1").replaceWith(`<h2>${clonedHeader("h1").text()}</h2>`);
                header = clonedHeader("header").html();
            }
            body.append(`
          <article>
            ${header}
            ${this.getImage(featuredImage)}
            <p>${excerpt || ""}</p>
            <a href="${pageUrl}">More...</a>
          <article>
        `);
        });
        body.append(`
      <div style="display: flex; justify-content: space-between;">
          ${this.previousPageLink()}
          ${this.nextPageLink()}
      </div>    
    `);
        return $;
    }
    getImage(image) {
        if (!image)
            return "";
        return `<img src="${image.src}" alt="${image.alt}">`;
    }
    previousPageLink() {
        if (!this.previousPageUrl) {
            return "";
        }
        return `<a href="${this.previousPageUrl}">Previous</a>`;
    }
    nextPageLink() {
        if (!this.nextPageUrl) {
            return "";
        }
        return `<a href="${this.nextPageUrl}">Next</a>`;
    }
}
exports.ArchivePageTemplate = ArchivePageTemplate;
