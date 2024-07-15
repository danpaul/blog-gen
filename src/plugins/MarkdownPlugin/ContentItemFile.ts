import { Dirent } from "fs-extra";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import * as path from "path";
import * as cheerio from "cheerio";

const fs = require("fs/promises");

const yaml = require("js-yaml");
const showdown = require("showdown");
const converter = new showdown.Converter({ metadata: true });

export class ContentItemFile implements ContentItemsInterface {
  title: string = "";
  type: string = "";
  published: Date = new Date();
  // @ts-ignore
  $: cheerio.Root;
  meta: {} = {};
  excerpt: string = "";
  pageUrl: string = "";
  featuredImage?: {
    src: string;
    alt: string;
  };

  constructor({ file, contentRoot }: { file: Dirent; contentRoot: string }) {
    // TODO: cleanup!!!
    return (async () => {
      const { name } = file;
      const isPage = name.substring(0, 4).toLowerCase() == "page";
      const cutFileName = isPage ? name.substring(5) : name;
      const unCutFileNameWithoutExtension = cutFileName.substring(
        0,
        cutFileName.length - 3
      );
      const cutFileNameWithoutExtension = cutFileName.substring(
        11,
        cutFileName.length - 3
      );
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
      const featuredImage =
        firstImage &&
        firstImage?.attr("src") &&
        // @ts-ignore
        firstImage.attr("src").indexOf("assets") == 0
          ? {
              src: firstImage.attr("src"),
              alt: firstImage.attr("alt") || "",
            }
          : null;

      const relativeUrlPath =
        (isPage ? cutFileNameWithoutExtension : unCutFileNameWithoutExtension)
          .toLocaleLowerCase()
          .replaceAll("_", "-") + ".html";

      this.title = title;
      this.type = isPage ? "page" : "post";
      this.published = new Date(dateString);
      this.$ = $;
      this.excerpt = excerpt;
      // @ts-ignore
      this.featuredImage = featuredImage || undefined;
      this.pageUrl = relativeUrlPath;
      this.meta = metadata;
      return this;
    })() as unknown as ContentItemFile;
  }
  // @ts-ignore
  render: () => Promise<string>;
}
