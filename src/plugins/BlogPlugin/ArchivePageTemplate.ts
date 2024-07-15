import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import * as cheerio from "cheerio";
import { IBlogGenImage } from "../../interfaces/IBlogGenImage";
import { CategoryLink } from "./BlogPlugin";

export class ArchivePageTemplate {
  private previousPageUrl?: string;
  private nextPageUrl?: string;
  private items: ContentItemsInterface[];
  private categoryLinks: CategoryLink[];
  constructor({
    previousPageUrl,
    nextPageUrl,
    items,
    categoryLinks,
  }: {
    previousPageUrl?: string;
    nextPageUrl?: string;
    items: ContentItemsInterface[];
    categoryLinks: CategoryLink[];
  }) {
    this.previousPageUrl = previousPageUrl;
    this.nextPageUrl = nextPageUrl;
    this.items = items;
    this.categoryLinks = categoryLinks;
  }
  render(): cheerio.Root {
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
        header = clonedHeader("header").html() || "";
      }
      body.append(
        `
          <article>
            ${header}
            ${this.getImage(featuredImage)}
            <p>${excerpt || ""}</p>
            <a href="${pageUrl}">More...</a>
          <article>
        `
      );
    });
    body.append(`
      <div style="display: flex; justify-content: space-between;">
          ${this.previousPageLink()}
          ${this.nextPageLink()}
      </div>    
    `);
    return $;
  }
  private getImage(image?: IBlogGenImage) {
    if (!image) return "";
    return `<img src="${image.src}" alt="${image.alt}">`;
  }
  private previousPageLink() {
    if (!this.previousPageUrl) {
      return "";
    }
    return `<a href="${this.previousPageUrl}">Previous</a>`;
  }
  private nextPageLink() {
    if (!this.nextPageUrl) {
      return "";
    }
    return `<a href="${this.nextPageUrl}">Next</a>`;
  }
}