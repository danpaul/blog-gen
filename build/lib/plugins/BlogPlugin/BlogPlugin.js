import { ArchivePageTemplate } from "./ArchivePageTemplate";
import { CategoryTree } from "./CategoryTree";
export class BlogPlugin {
    constructor({ itemsPerPage }) {
        this.itemsPerPage = itemsPerPage;
    }
    async init(blogGen) {
        blogGen.addContentItemsFilter(this.filterContentItems.bind(this));
        blogGen.addMenuItemsFilter(this.menuFilter.bind(this));
    }
    async menuFilter({ menuItems, contentItems, }) {
        const blogContentItems = this.getBlogContentItems(contentItems);
        const categoryMenuItems = [];
        const addNodes = (node, menuItems, categories) => {
            for (const property in node.children) {
                const currentCategory = [...categories, property];
                const currentNode = node.children[property];
                const menuItem = {
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
    async filterContentItems(contentItems) {
        const blogContentItems = this.getBlogContentItems(contentItems);
        return [
            ...this.addBlogMetaToPageContentItems(contentItems),
            // add main, uncategorized blog items
            ...this.getArchivePages(blogContentItems),
            // get category archive pages
            ...(await this.getCategoryArchivePages(blogContentItems)),
        ];
    }
    addBlogMetaToPageContentItems(contentItems) {
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
    getArchivePages(contentItems) {
        return this.generateArchivePages({
            paginatedItems: this.paginate(contentItems),
        });
    }
    async getCategoryArchivePages(contentItems) {
        let categoryArchivePages = [];
        await new CategoryTree({ contentItems }).iterateTree(async (categories, items) => {
            const paginatedCategoryItems = this.paginate(items);
            categoryArchivePages = [
                ...categoryArchivePages,
                ...this.generateArchivePages({
                    paginatedItems: paginatedCategoryItems,
                    categories,
                }),
            ];
        });
        return categoryArchivePages;
    }
    getBlogContentItems(contentItems) {
        return contentItems
            .filter(({ type }) => type == "post")
            .sort(this.compareItemsByDate);
    }
    generateArchivePages({ paginatedItems, categories, }) {
        const contentItems = [];
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
    compareItemsByDate(a, b) {
        if (!a && !b) {
            return 0;
        }
        else if (a && !b) {
            return -1;
        }
        else if (!a && b) {
            return 1;
        }
        return b.published.getMilliseconds() - a.published.getMilliseconds();
    }
    paginate(items) {
        const paginatedItems = [];
        const numberOfPages = Math.ceil(items.length / this.itemsPerPage);
        for (let i = 1; i <= numberOfPages; i++) {
            paginatedItems.push(items.slice((i - 1) * this.itemsPerPage, this.itemsPerPage * i));
        }
        return paginatedItems;
    }
    getCategoryId(categories) {
        return categories ? categories.join("-") : "";
    }
    getCategoryUrl(categories, page) {
        return `category-${categories.join("-")}-${page}.html`;
    }
    getCategoryLink(categories) {
        const link = {
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
    getCategoryLinks(categories) {
        const links = [];
        if (!categories)
            return links;
        for (let i = 0; i < categories.length; i++) {
            const categoriesSubgroup = categories.slice(0, i + 1);
            links.push(this.getCategoryLink(categoriesSubgroup));
        }
        return links;
    }
    getPageUrls({ paginatedItems, categories, index, }) {
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
