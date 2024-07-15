import * as cheerio from "cheerio";
export class ArchivePageTemplate {
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
