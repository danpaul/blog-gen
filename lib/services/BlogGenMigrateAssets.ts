import * as fs from "fs-extra";
import * as path from "path";

import IBloGenOptions from "../interfaces/IBlogGenOptions";
import constants from "../constants";

const BlogGenMigrateAssets = async (options: IBloGenOptions) => {
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
