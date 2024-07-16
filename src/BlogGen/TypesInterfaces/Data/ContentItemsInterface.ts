import { ImageInterface } from "./ImageInterface";

export interface ContentItemsInterface {
  title: string;
  type: string;
  published?: Date;
  excerpt?: string;
  featuredImage?: ImageInterface;
  $: cheerio.Root;
  meta: {
    [key: string]: any;
  };
  pageUrl: string;
}
