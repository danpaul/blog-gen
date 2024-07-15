interface ContentItemsInterface {
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
    pageUrl: string;
}

type SourceFilterType = (contentItems: ContentItemsInterface[]) => Promise<ContentItemsInterface[]>;

interface PluginInterface {
    init: (blogGen: BlogGenBase) => void;
}

type ContentItemsFilterType = (contentItems: ContentItemsInterface[]) => Promise<ContentItemsInterface[]>;

interface MenuItemInterface {
    title: string;
    href?: string;
    children?: MenuItemInterface[];
}

type MenuItemsFilterType = (params: {
    menuItems: MenuItemInterface[];
    contentItems: ContentItemsInterface[];
}) => Promise<MenuItemInterface[]>;

type PreBuildFilterType = (params: {
    menuItems: MenuItemInterface[];
    contentItems: ContentItemsInterface[];
}) => Promise<void>;

type BuildFilterType = (args: {
    contentItems: ContentItemsInterface[];
}) => Promise<void>;

type BlogGenSiteOptionsType = {
    title: string;
    description: string;
    author: string;
    keywords: string[];
};
type BlogGenBuildOptionsType = {
    contentRoot: string;
    distRoot: string;
    itemsPerPage: number;
};
type BlogGenOptionsType = {
    site: BlogGenSiteOptionsType;
    build: BlogGenBuildOptionsType;
};

declare class BlogGenBase {
    private sourceFilters;
    private contentItemsFilters;
    private menuItemsFilters;
    private preBuildFilters;
    private buildFilters;
    private contentItems;
    private menuItems;
    readonly siteOptions: BlogGenSiteOptionsType;
    constructor(siteOptions: BlogGenSiteOptionsType);
    run(): Promise<void>;
    addPlugin(plugin: PluginInterface): void;
    addSourceFilter(sourceFilter: SourceFilterType): void;
    addContentItemsFilter(contentItemsFilter: ContentItemsFilterType): void;
    addMenuItemsFilter(menuItemsFilter: MenuItemsFilterType): void;
    addPreBuildFilter(preBuildFilter: PreBuildFilterType): void;
    addBuildFilter(buildFilter: BuildFilterType): void;
}

declare class BlogGen extends BlogGenBase {
    constructor(options: BlogGenOptionsType);
}

export { BlogGen, BlogGenBase };