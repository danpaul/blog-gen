"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BlogGenBase {
    constructor(siteOptions) {
        // filters
        this.sourceFilters = [];
        this.contentItemsFilters = [];
        this.menuItemsFilters = [];
        this.preBuildFilters = [];
        this.buildFilters = [];
        // content items
        this.contentItems = [];
        // menuItems
        this.menuItems = [];
        this.siteOptions = siteOptions;
    }
    async run() {
        // source filters
        for (const sourceFilter of this.sourceFilters) {
            this.contentItems = await sourceFilter(this.contentItems);
        }
        // content items filter
        for (const contentItemFilter of this.contentItemsFilters) {
            this.contentItems = await contentItemFilter(this.contentItems);
        }
        // menu filters
        for (const menuItemsfilter of this.menuItemsFilters) {
            this.menuItems = await menuItemsfilter({
                menuItems: this.menuItems,
                contentItems: this.contentItems,
            });
        }
        // pre build filters
        for (const preBuildFilter of this.preBuildFilters) {
            await preBuildFilter({
                menuItems: this.menuItems,
                contentItems: this.contentItems,
            });
        }
        // build filters
        for (const buildFilter of this.buildFilters) {
            await buildFilter({
                contentItems: this.contentItems,
            });
        }
    }
    addPlugin(plugin) {
        plugin.init(this);
    }
    // used for `this.contentItems`
    addSourceFilter(sourceFilter) {
        this.sourceFilters.push(sourceFilter);
    }
    // runs after content items are added to add additional generated items
    addContentItemsFilter(contentItemsFilter) {
        this.contentItemsFilters.push(contentItemsFilter);
    }
    // used to generate menu items for `this.menuItems`
    addMenuItemsFilter(menuItemsFilter) {
        this.menuItemsFilters.push(menuItemsFilter);
    }
    // runs before build
    addPreBuildFilter(preBuildFilter) {
        this.preBuildFilters.push(preBuildFilter);
    }
    // runs to build
    addBuildFilter(buildFilter) {
        this.buildFilters.push(buildFilter);
    }
}
exports.default = BlogGenBase;
