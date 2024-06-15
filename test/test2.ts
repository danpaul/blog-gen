import BlogGen from "../lib/BlogGen/BlogGen";
import { MarkdownPlugin } from "../lib/plugins/MarkdownPlugin/MarkdownPlugin";

const CONTENT_ROOT = __dirname + "/blog";
const DIST_ROOT = __dirname + "/dist";

(async () => {
  const blogGen = new BlogGen({ distRoot: DIST_ROOT });
  const markdownPlugin = new MarkdownPlugin({ contentRoot: CONTENT_ROOT });

  await blogGen.addPlugin(markdownPlugin);
  await blogGen.run();

  console.log("success!");
})();
