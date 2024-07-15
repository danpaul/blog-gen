"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuPlugin = void 0;
const InjectMenu_1 = require("./InjectMenu");
class MenuPlugin {
    async init(blogGen) {
        this.blogGen = blogGen;
        this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
    }
    async preBuildFilter({ menuItems, contentItems, }) {
        return new InjectMenu_1.InjectMenu({
            menuItems,
            contentItems,
            options: this.blogGen.siteOptions,
        }).inject();
    }
}
exports.MenuPlugin = MenuPlugin;
