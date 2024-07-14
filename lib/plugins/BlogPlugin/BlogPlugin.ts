import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGenBase";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { ArchivePageTemplate } from "./ArchivePageTemplate";
import { CategoryTree, CategoryTreeNode } from "./CategoryTree";
import { MenuItemInterface } from "../../BlogGen/TypesInterfaces/Data/MenuItemInterface";

export type CategoryLink = {
  label: string;
  url: string;
};

export class BlogPlugin implements PluginInterface {
  private itemsPerPage: number;

  constructor({ itemsPerPage }: { itemsPerPage: number }) {
    this.itemsPerPage = itemsPerPage;
  }

  async init(blogGen: BlogGen) {
    blogGen.addContentItemsFilter(this.filterContentItems.bind(this));
    blogGen.addMenuItemsFilter(this.menuFilter.bind(this));
  }

  async menuFilter({
    menuItems,
    contentItems,
  }: {
    menuItems: MenuItemInterface[];
    contentItems: ContentItemsInterface[];
  }): Promise<MenuItemInterface[]> {
    const blogContentItems = this.getBlogContentItems(contentItems);
    const categoryMenuItems: MenuItemInterface[] = [];

    const addNodes = (
      node: CategoryTreeNode,
      menuItems: MenuItemInterface[],
      categories: string[]
    ) => {
      for (const property in node.children) {
        const currentCategory = [...categories, property];
        const currentNode = node.children[property];
        const menuItem: MenuItemInterface = {
          title: property,
          href: this.getCategoryLink(currentCategory).url,
        };
        if (Object.keys(currentNode.children).length) {
          menuItem.children = [];
          addNodes(currentNode, menuItem.children, currentCategory);
        }
        menuItems.push(menuItem);
      }
    };

    const categoryTree = new CategoryTree({ contentItems: blogContentItems });
    if (Object.keys(categoryTree.tree.children).length) {
      categoryMenuItems.push({ title: "Categories", children: [] });
      addNodes(categoryTree.tree, categoryMenuItems[0].children, []);
    }
    return [
      ...menuItems,
      ...(categoryMenuItems.length ? categoryMenuItems : []),
    ];
  }

  async filterContentItems(contentItems: ContentItemsInterface[]) {
    const blogContentItems = this.getBlogContentItems(contentItems);
    return [
      ...this.addBlogMetaToPageContentItems(contentItems),
      // add main, uncategorized blog items
      ...this.getArchivePages(blogContentItems),
      // get category archive pages
      ...(await this.getCategoryArchivePages(blogContentItems)),
    ];
  }

  private addBlogMetaToPageContentItems(
    contentItems: ContentItemsInterface[]
  ): ContentItemsInterface[] {
    return contentItems.map((contentItem) => {
      const categoryLinks = this.getCategoryLinks(contentItem.meta.category);
      const header = contentItem.$("body header");
      if (categoryLinks.length && header) {
        let el = "<h6>Category: ";
        categoryLinks.forEach(({ label, url }, index) => {
          el = `${el}<a href="${url}">${label}</a>`;
          if (index < categoryLinks.length - 1) {
            el = `${el} / `;
          }
        });
        el = `${el}</h6>`;
        header.append(el);
      }
      return contentItem;
    });
  }

  private getArchivePages(contentItems: ContentItemsInterface[]) {
    return this.generateArchivePages({
      paginatedItems: this.paginate(contentItems),
    });
  }

  private async getCategoryArchivePages(
    contentItems: ContentItemsInterface[]
  ): Promise<ContentItemsInterface[]> {
    let categoryArchivePages: ContentItemsInterface[] = [];
    await new CategoryTree({ contentItems }).iterateTree(
      async (categories, items) => {
        const paginatedCategoryItems = this.paginate(items);
        categoryArchivePages = [
          ...categoryArchivePages,
          ...this.generateArchivePages({
            paginatedItems: paginatedCategoryItems,
            categories,
          }),
        ];
      }
    );
    return categoryArchivePages;
  }

  private getBlogContentItems(contentItems: ContentItemsInterface[]) {
    return contentItems
      .filter(({ type }) => type == "post")
      .sort(this.compareItemsByDate);
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
        categoryLinks: this.getCategoryLinks(categories),
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

  private getCategoryLink(categories: string[]): CategoryLink {
    const link: CategoryLink = {
      label: "",
      url: "",
    };
    if (!categories.length) {
      console.error("cannot build link from empty category");
      return link;
    }
    link.label = categories[categories.length - 1];
    link.url = this.getCategoryUrl(categories, 1);
    return link;
  }

  private getCategoryLinks(categories?: string[]): CategoryLink[] {
    const links: CategoryLink[] = [];
    if (!categories) return links;
    for (let i = 0; i < categories.length; i++) {
      const categoriesSubgroup = categories.slice(0, i + 1);
      links.push(this.getCategoryLink(categoriesSubgroup));
    }
    return links;
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
