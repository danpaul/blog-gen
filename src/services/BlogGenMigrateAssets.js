// import * as fs from "fs-extra";
const fs = require("fs/promises");
import * as path from "path";
import constants from "../constants";
const BlogGenMigrateAssets = async (options) => {
  const contentAssetRoot = `${options.contentRoot}${constants.localAssetPath}`;
  const assetDirExists = await fs.pathExists(contentAssetRoot);
  if (assetDirExists) {
    fs.copy(contentAssetRoot, `${options.distRoot}${constants.assetPath}`);
  }
  await fs.copy(
    path.normalize("./node_modules/github-markdown-css/github-markdown.css"),
    path.normalize(`${options.distRoot}${constants.assetPathBlogGenCss}`)
  );
};
export default BlogGenMigrateAssets;
