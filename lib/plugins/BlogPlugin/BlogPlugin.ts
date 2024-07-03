import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGen";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import * as cheerio from "cheerio";
import { ArchivePageTempate } from "./ArchivePageTemplate";

export class BlogPlugin implements PluginInterface {
  private itemsPerPage: number;

  constructor({ itemsPerPage }: { itemsPerPage: number }) {
    this.itemsPerPage = itemsPerPage;
  }

  async init(blogGen: BlogGen) {
    blogGen.addContentItemsFilter(this.filterContentItems.bind(this));
  }

  async filterContentItems(contentItems: ContentItemsInterface[]) {
    let returnItems = [...contentItems];
    const blogItems = contentItems
      .filter(({ type }) => type == "post")
      .sort(this.compareItemsByDate);
    const paginatedItems = this.paginate(blogItems);

    returnItems = [
      ...returnItems,
      ...this.generateArchivePages({ paginatedItems }),
    ];

    const doc = cheerio.load("");

    // paginate all
    // update page meta
    // paginate based on categories
    // paginate based

    return returnItems;
  }

  private compareItemsByDate(
    a: ContentItemsInterface,
    b: ContentItemsInterface
  ) {
    if (!a && !b) {
      return 0;
    } else if (a && !b) {
      return -1;
    } else if (!a && b) {
      return 1;
    }
    return b.published.getMilliseconds() - a.published.getMilliseconds();
  }

  private paginate(items: ContentItemsInterface[]): ContentItemsInterface[][] {
    const paginatedItems: ContentItemsInterface[][] = [];
    const numberOfPages = Math.ceil(items.length / this.itemsPerPage);
    for (let i = 1; i <= numberOfPages; i++) {
      paginatedItems.push(
        items.slice((i - 1) * this.itemsPerPage, this.itemsPerPage * i)
      );
    }
    return paginatedItems;
  }

  private generateArchivePages({
    paginatedItems,
    categories,
  }: {
    paginatedItems: ContentItemsInterface[][];
    categories?: string[];
  }): ContentItemsInterface[] {
    const contentItems: ContentItemsInterface[] = [];
    paginatedItems.forEach((items, index) => {
      const hasNextPage = paginatedItems.length > index + 1;
      const hasPreviousPage = index != 0;
      const isHome = !categories && index == 0;
      const categoryBase = categories ? categories.join("-") : "";
      const pageUrl = isHome
        ? "index.html"
        : `${categoryBase}${index + 1}.html`;
      const nextPageUrl = hasNextPage
        ? `${categoryBase}${index + 2}.html`
        : null;
      const previousPageUrl = hasPreviousPage
        ? categoryBase
          ? `${categoryBase}${index}.html`
          : "index.html"
        : null;
      // asdf
      console.log("nextPageUrl", nextPageUrl);
      const archivePageTempate = new ArchivePageTempate({
        previousPageUrl,
        nextPageUrl,
        items,
      });
      contentItems.push({
        title: isHome
          ? "Home"
          : categoryBase
          ? `${categoryBase}-${index + 1}`
          : `archive-${index + 1}`,
        type: "blog-archive",
        meta: {},
        pageUrl,
        $: archivePageTempate.render(),
      });
    });
    return contentItems;
  }
}
