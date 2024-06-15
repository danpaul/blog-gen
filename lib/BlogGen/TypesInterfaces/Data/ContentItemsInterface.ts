export interface ContentItemsInterface {
  title: string;
  type: string;
  published?: Date;
  excerpt?: string;
  featuredImage?: {
    src: string;
    alt: string;
  };
  $: cheerio.Root;
  meta: {
    [key: string]: any;
  };
  distPath: string;
  // getDistPath: () => string;
  render: () => Promise<string>;
  pageUrl: string;
}
