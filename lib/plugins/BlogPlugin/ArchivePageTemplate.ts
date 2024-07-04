import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import * as cheerio from "cheerio";
import { IBlogGenImage } from "../../interfaces/IBlogGenImage";

export class ArchivePageTemplate {
  private previousPageUrl?: string;
  private nextPageUrl?: string;
  private items: ContentItemsInterface[];
  constructor({
    previousPageUrl,
    nextPageUrl,
    items,
  }: {
    previousPageUrl?: string;
    nextPageUrl?: string;
    items: ContentItemsInterface[];
  }) {
    this.previousPageUrl = previousPageUrl;
    this.nextPageUrl = nextPageUrl;
    this.items = items;
  }
  render(): cheerio.Root {
    const $ = cheerio.load("");
    const body = $("body");
    this.items.forEach(({ title, featuredImage, excerpt, pageUrl }) => {
      body.append(
        `
          <article>
            <h2>${title}</h2>
            ${this.getImage(featuredImage)}
            <p>${excerpt || ""}</p>
            <a href="${pageUrl}">Read More</a>
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
