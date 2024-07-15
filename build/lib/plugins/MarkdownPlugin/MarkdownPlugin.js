import * as fs from "fs/promises";
import { FileMapper } from "./FileMapper";
import { ContentItemFilter } from "./ContentItemFilter";
import { MenuItemFilter } from "./MenuItemFilter";
export class MarkdownPlugin {
    constructor({ contentRoot }) {
        this.contentRoot = contentRoot;
    }
    async init(blogGen) {
        this.blogGen = blogGen;
        this.blogGen.addSourceFilter(this.sourceFilter.bind(this));
        this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
        this.blogGen.addMenuItemsFilter(this.menuFilter.bind(this));
    }
    async sourceFilter(contentItems) {
        const files = await fs.readdir(this.contentRoot, { withFileTypes: true });
        const fileMapper = new FileMapper({ files, contentRoot: this.contentRoot });
        return [...contentItems, ...(await fileMapper.mapFiles())];
    }
    async preBuildFilter({ contentItems, }) {
        contentItems.map((contentItem) => ContentItemFilter({ contentItem, options: this.blogGen.siteOptions }));
    }
    async menuFilter({ menuItems, contentItems, }) {
        return MenuItemFilter({ menuItems, contentItems });
    }
}
