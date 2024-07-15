import { BlogPlugin } from "../plugins/BlogPlugin/BlogPlugin";
import { FileBuildPlugin } from "../plugins/FileBuildPlugin/FileBuildPlugin";
import { GithubMarkdownStylePlugin } from "../plugins/GithubMarkdownStylePlugin/GithubMarkdownStylePlugin";
import { MarkdownPlugin } from "../plugins/MarkdownPlugin/MarkdownPlugin";
import { MenuPlugin } from "../plugins/MenuPlugin/MenuPlugin";
import BlogGenBase from "./BlogGenBase";
import { BlogGenOptionsType } from "./Options";

class BlogGen extends BlogGenBase {
  constructor(options: BlogGenOptionsType) {
    super(options.site);
    const { contentRoot, distRoot, itemsPerPage } = options.build;
    this.addPlugin(new MarkdownPlugin({ contentRoot }));
    this.addPlugin(new MenuPlugin());
    this.addPlugin(
      new GithubMarkdownStylePlugin({
        distRoot,
      })
    );
    this.addPlugin(
      new BlogPlugin({
        itemsPerPage,
      })
    );
    this.addPlugin(new FileBuildPlugin({ distRoot, contentRoot }));
  }
}

export default BlogGen;