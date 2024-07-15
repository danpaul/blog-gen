import { Dirent } from "node:fs";
import * as path from "path";
import IBloGenOptions from "../interfaces/IBlogGenOptions";
import { IBlogGenParsedFile } from "../interfaces/IBlogGenParsedFile";
import * as cheerio from "cheerio";

const fs = require("fs/promises");

const yaml = require("js-yaml");
const showdown = require("showdown");

const converter = new showdown.Converter({ metadata: true });

interface IBlogGenParseFiles extends IBloGenOptions {
  files: Dirent[];
}

export const BlogGenParseFile = async ({
  file,
  contentRoot,
  distRoot,
}: {
  file: Dirent;
  contentRoot: string;
  distRoot: string;
}): Promise<IBlogGenParsedFile> => {
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
  const metadata = yaml.load(converter.getMetadata(true)) || {};

  const excerpt = $("p").first().text() || "";
  const firstImage = $("img").first();
  const featuredImage =
    firstImage &&
    firstImage.attr("src") &&
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

  return {
    title,
    type: isPage ? "page" : "post",
    publishedDate: new Date(dateString),
    filePath,
    buildPath: path.normalize(distRoot + "/" + relativeUrlPath),
    $,
    excerpt,
    featuredImage,
    relativeUrlPath,
    metadata,
  };
};

const BlogGenParseFiles = async ({
  files,
  contentRoot,
  distRoot,
}: IBlogGenParseFiles): Promise<IBlogGenParsedFile[]> => {
  return Promise.all(
    files.map((file) => BlogGenParseFile({ file, contentRoot, distRoot }))
  );
};

export default BlogGenParseFiles;
