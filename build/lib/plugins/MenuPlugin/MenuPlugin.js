import { InjectMenu } from "./InjectMenu";
export class MenuPlugin {
    async init(blogGen) {
        this.blogGen = blogGen;
        this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
    }
    async preBuildFilter({ menuItems, contentItems, }) {
        return new InjectMenu({
            menuItems,
            contentItems,
            options: this.blogGen.siteOptions,
        }).inject();
    }
}
