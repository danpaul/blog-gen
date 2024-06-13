import { BlogGenInitDirs, BlogGenReadFiles, IBloGenOptions } from "../index";
import * as assert from "assert";
import BlogGenFilterFiles from "../lib/services/BlogGenFilterFiles";
import BlogGenParseFiles from "../lib/services/BlogGenParseFiles";
import BlogGenSort from "../lib/services/BlogGenSort";
import BlogGenGetSiteMeta from "../lib/services/BlogGenGetSiteMeta";
import BlogGenBuild from "../lib/services/BlogGenBuild/index";
import BlogGenMigrateAssets from "../lib/services/BlogGenMigrateAssets";
import BlogGenPluginMapPage from "../lib/plugins/BlogGenPluginMapPage";
import BlogGenPluginMapBlog from "../lib/plugins/BlogGenPluginMapBlog";

const express = require("express");

const CONTENT_ROOT = __dirname + "/blog";
const DIST_ROOT = __dirname + "/dist";

const options = {
  contentRoot: CONTENT_ROOT,
  distRoot: DIST_ROOT,
};

(async () => {
  console.log("starting tests...");
  await BlogGenInitDirs(options);

  // get site meta
  const siteMeta = await BlogGenGetSiteMeta({ options });

  assert(siteMeta.title == "My Site", "site meta title is not correct");

  // read files
  const allFiles = await BlogGenReadFiles(options);

  // filter public
  const filteredFiles = BlogGenFilterFiles({ files: allFiles });
  assert(filteredFiles.length == 3, "There should be 3 filtered files");

  // test hook
  const hookfilteredFiles = BlogGenFilterFiles({
    files: allFiles,
    hooks: [() => false],
  });
  assert(
    hookfilteredFiles.length == 0,
    "There should be 0 hook filtered files"
  );

  // test filter
  const filterfilteredFiles = BlogGenFilterFiles({
    files: allFiles,
    filters: [(f) => !f.name.includes("Some_file")],
  });
  assert(
    filterfilteredFiles.length == 3,
    "There should be 3 filter filtered files"
  );

  // parse files
  const parsedFiles = await BlogGenParseFiles({
    files: filteredFiles,
    ...options,
  });

  assert(parsedFiles[0].title == "Hello World", "first file title not correct");
  assert(parsedFiles[2].type == "page", "third file should be page");

  // sort files
  const sortedFiles = BlogGenSort({ files: parsedFiles });

  assert(sortedFiles.posts.length == 2, "There should be 2 posts");
  assert(sortedFiles.pages.length == 1, "There should be 1 page");
  assert(
    sortedFiles.posts[0].publishedDate.getTime() >
      sortedFiles.posts[1].publishedDate.getTime(),
    "post order is not correct"
  );

  assert(
    sortedFiles.posts[0].featuredImage.src == "assets/test.png",
    "featured image not set"
  );

  assert(
    sortedFiles.posts[0].excerpt == "This is the first paragraph",
    "excerpt not found"
  );

  // let siteMap: IBlogGenPageNode[] = [];
  let pageNodes = await BlogGenPluginMapPage({
    parsedFiles: sortedFiles,
    siteMeta,
    options,
    nodes: [],
  });

  pageNodes = await BlogGenPluginMapBlog({
    parsedFiles: sortedFiles,
    siteMeta,
    options,
    nodes: pageNodes,
  });

  // asdf
  // console.log(JSON.stringify(pageNodes));

  // build site
  await BlogGenBuild({ pageNodes, siteMeta });

  // migrate assets
  await BlogGenMigrateAssets(options);

  console.log("success!!!");

  const app = express();
  const port = 3000;
  app.use(express.static(options.distRoot));
  app.listen(port, () => {
    console.log(`Serving site on: ${port}`);
  });
})();
