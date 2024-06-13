import { IBlogGenImage } from "./IBlogGenImage";

export interface IBlogGenParsedFile {
  title: string;
  type: "page" | "post";
  publishedDate: Date;
  filePath: string;
  buildPath: string;
  excerpt: string;
  featuredImage?: IBlogGenImage;
  relativeUrlPath: string;
  $: cheerio.Root;
  metadata?: any;
}
