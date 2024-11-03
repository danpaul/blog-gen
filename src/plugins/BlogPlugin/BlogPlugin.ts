import { PluginInterface } from "../../BlogGen/TypesInterfaces/Plugins/PluginInterface";
import BlogGen from "../../BlogGen/BlogGenBase";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { ArchivePageTemplate } from "./ArchivePageTemplate";
import { CategoryTree, CategoryTreeNode } from "./CategoryTree";
import { MenuItemInterface } from "../../BlogGen/TypesInterfaces/Data/MenuItemInterface";
import { TagContentItemsMap } from "./TagContentItemsMap";

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
      if (categoryMenuItems[0].children) {
        addNodes(categoryTree.tree, categoryMenuItems[0].children, []);
      }
    }

    const tagMenuItems: MenuItemInterface[] = [];
    const tagContentItemsMap = new TagContentItemsMap({ contentItems });
    if (Object.keys(tagContentItemsMap).length) {
      tagMenuItems.push({ title: "Tags", children: [] });
      const parent = tagMenuItems[0].children;
      Object.keys(tagContentItemsMap.map).forEach((tag) => {
        parent?.push({
          // @ts-ignore
          title: `${tag}(${tagContentItemsMap.map[tag].length})`,
          href: this.getTagUrl({ tag, page: 1 }),
        });
      });
    }

    return [...menuItems, ...categoryMenuItems, ...tagMenuItems];
  }

  async filterContentItems(contentItems: ContentItemsInterface[]) {
    const blogContentItems = this.getBlogContentItems(contentItems);

    return [
      ...this.addBlogMetaToPageContentItems(contentItems),
      // add main, uncategorized blog items
      ...this.generateArchivePages({
        paginatedItems: this.paginate(blogContentItems),
      }),
      // get category archive pages
      ...(await this.getCategoryArchivePages(blogContentItems)),
      // generate tag archive pages
      ...(await this.getTagArchivePages(blogContentItems)),
      // generate tag blog items
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

  private async getTagArchivePages(
    contentItems: ContentItemsInterface[]
  ): Promise<ContentItemsInterface[]> {
    let tagArchivePages: ContentItemsInterface[] = [];
    const tagContentItemsMap = new TagContentItemsMap({ contentItems });
    Object.keys(tagContentItemsMap.map).forEach((tag) => {
      const contentItems = tagContentItemsMap.map[tag];
      const paginatedTagItems = this.paginate(contentItems);
      const test = this.generateArchivePages({
        paginatedItems: paginatedTagItems,
        categories: [tag],
        isTag: true,
      });

      tagArchivePages = [
        ...tagArchivePages,
        ...this.generateArchivePages({
          paginatedItems: paginatedTagItems,
          categories: [tag],
          isTag: true,
        }),
      ];
    });

    return tagArchivePages;
  }

  private getBlogContentItems(contentItems: ContentItemsInterface[]) {
    return contentItems
      .filter(({ type }) => type == "post")
      .sort(this.compareItemsByDate);
  }

  private generateArchivePages({
    paginatedItems,
    categories,
    isTag = false,
  }: {
    paginatedItems: ContentItemsInterface[][];
    categories?: string[];
    isTag?: boolean;
  }): ContentItemsInterface[] {
    const contentItems: ContentItemsInterface[] = [];
    paginatedItems.forEach((items, index) => {
      const { pageUrl, nextPageUrl, previousPageUrl } = this.getPageUrls({
        paginatedItems,
        categories,
        index,
        isTag,
      });
      const isHome = !categories && index == 0;
      const categoryId = this.getCategoryId(categories, isTag);
      const archivePageTemplate = new ArchivePageTemplate({
        previousPageUrl: previousPageUrl || undefined,
        nextPageUrl: nextPageUrl || undefined,
        items,
        categoryLinks: this.getCategoryLinks(categories, isTag),
        isTag,
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
    return (
      (b?.published ? b.published.getMilliseconds() : 0) -
      (a?.published ? a.published.getMilliseconds() : 0)
    );
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

  private getCategoryId(categories?: string[], isTag: boolean = false) {
    if (isTag) {
      return `tag-${categories?.[0] || ""}`;
    }
    return categories ? categories.join("-") : "";
  }

  private getCategoryUrl(categories: string[], page: number) {
    return `category-${categories.join("-")}-${page}.html`;
  }

  private getCategoryLink(
    categories: string[],
    isTag: boolean = false
  ): CategoryLink {
    const link: CategoryLink = {
      label: "",
      url: "",
    };
    if (!categories.length) {
      console.error("cannot build link from empty category");
      return link;
    }
    link.label = categories[categories.length - 1];
    link.url = isTag
      ? this.getTagUrl({ tag: categories[0], page: 1 })
      : this.getCategoryUrl(categories, 1);
    return link;
  }

  private getCategoryLinks(
    categories?: string[],
    isTag: boolean = false
  ): CategoryLink[] {
    if (isTag) {
      if (!categories || !categories.length) {
        return [];
      }
      return [this.getCategoryLink(categories, true)];
    }
    const links: CategoryLink[] = [];
    if (!categories) return links;
    for (let i = 0; i < categories.length; i++) {
      const categoriesSubgroup = categories.slice(0, i + 1);
      links.push(this.getCategoryLink(categoriesSubgroup));
    }
    return links;
  }

  private getTagUrl({ tag, page }: { tag: string; page: number }) {
    return `tag-${tag}-${page}.html`;
  }

  private getPageUrls({
    paginatedItems,
    categories,
    index,
    isTag = false,
  }: {
    paginatedItems: ContentItemsInterface[][];
    categories?: string[];
    index: number;
    isTag: boolean;
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
      ? isTag
        ? this.getTagUrl({ tag: categories[0] || "", page: index + 1 })
        : this.getCategoryUrl(categories, index + 1)
      : `${index + 1}.html`;
    const nextPageUrl = hasNextPage
      ? categories
        ? isTag
          ? this.getTagUrl({ tag: categories[0] || "", page: index + 2 })
          : this.getCategoryUrl(categories, index + 2)
        : `${index + 2}.html`
      : null;
    let previousPageUrl = hasPreviousPage
      ? categories
        ? this.getCategoryUrl(categories, index)
        : index == 1
        ? "index.html"
        : `${index}.html`
      : null;
    if (isTag) {
      previousPageUrl = hasPreviousPage
        ? this.getTagUrl({ tag: categories?.[0] || "", page: index + 2 })
        : null;
    }

    return {
      pageUrl,
      nextPageUrl,
      previousPageUrl,
    };
  }
}
