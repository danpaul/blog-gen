import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGen";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { ArchivePageTemplate } from "./ArchivePageTemplate";
import { CategoryTree } from "./CategoryTree";

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

    // category tree
    const categoryTree = new CategoryTree({ contentItems });
    await categoryTree.iterateTree(async (categories, items) => {
      const paginatedCategoryItems = this.paginate(items);
      returnItems = [
        ...returnItems,
        ...this.generateArchivePages({
          paginatedItems: paginatedCategoryItems,
          categories,
        }),
      ];
    });

    return returnItems;
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
      const { pageUrl, nextPageUrl, previousPageUrl } = this.getPageUrls({
        paginatedItems,
        categories,
        index,
      });
      const isHome = !categories && index == 0;
      const categoryId = this.getCategoryId(categories);
      const archivePageTemplate = new ArchivePageTemplate({
        previousPageUrl,
        nextPageUrl,
        items,
        categories,
      });
      contentItems.push({
        title: isHome
          ? "Home"
          : categoryId
          ? `${categoryId}-${index + 1}`
          : `archive-${index + 1}`,
        type: "blog-archive",
        meta: {},
        pageUrl,
        $: archivePageTemplate.render(),
      });
    });
    return contentItems;
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

  private getCategoryId(categories?: string[]) {
    return categories ? categories.join("-") : "";
  }

  private getCategoryUrl(categories: string[], page: number) {
    return `category-${categories.join("-")}-${page}.html`;
  }

  private getPageUrls({
    paginatedItems,
    categories,
    index,
  }: {
    paginatedItems: ContentItemsInterface[][];
    categories?: string[];
    index: number;
  }): {
    pageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  } {
    const hasNextPage = paginatedItems.length > index + 1;
    const hasPreviousPage = index != 0;
    const isHome = !categories && index == 0;
    const pageUrl = isHome
      ? "index.html"
      : categories
      ? this.getCategoryUrl(categories, index + 1)
      : `${index + 1}.html`;
    const nextPageUrl = hasNextPage
      ? categories
        ? this.getCategoryUrl(categories, index + 2)
        : `${index + 2}.html`
      : null;
    const previousPageUrl = hasPreviousPage
      ? categories
        ? this.getCategoryUrl(categories, index)
        : index == 1
        ? "index.html"
        : `${index}.html`
      : null;

    return {
      pageUrl,
      nextPageUrl,
      previousPageUrl,
    };
  }
}
