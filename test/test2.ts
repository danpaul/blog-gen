import BlogGen from "../lib/BlogGen/BlogGen";
import { MarkdownPlugin } from "../lib/plugins/MarkdownPlugin/MarkdownPlugin";
import { MenuPlugin } from "../lib/plugins/MenuPlugin/MenuPlugin";
import { GithubMarkdownStylePlugin } from "../lib/plugins/GithubMarkdownStylePlugin/GithubMarkdownStylePlugin";
import { FileBuildPlugin } from "../lib/plugins/FileBuildPlugin/FileBuildPlugin";
import { BlogPlugin } from "../lib/plugins/BlogPlugin/BlogPlugin";

const express = require("express");

const CONTENT_ROOT = __dirname + "/blog";
const DIST_ROOT = __dirname + "/dist";
const ITEMS_PER_PAGE = 1;

(async () => {
  const blogGen = new BlogGen({ siteTitle: "my site" });

  await blogGen.addPlugin(new MarkdownPlugin({ contentRoot: CONTENT_ROOT }));
  await blogGen.addPlugin(new MenuPlugin());
  await blogGen.addPlugin(
    new GithubMarkdownStylePlugin({
      distRoot: DIST_ROOT,
    })
  );
  await blogGen.addPlugin(
    new BlogPlugin({
      itemsPerPage: ITEMS_PER_PAGE,
    })
  );
  await blogGen.addPlugin(new FileBuildPlugin({ distRoot: DIST_ROOT }));

  await blogGen.run();

  // add pagination plugin
  // add taxonomy plugin
  // add minification plugin
  // add image resize plugin

  const app = express();
  const port = 3000;
  app.use(express.static(DIST_ROOT));
  app.listen(port, () => {
    console.log(`Serving site on: ${port}`);
  });

  console.log("success!");
})();
