import { ensureDir, emptyDir } from "fs-extra";
import constants from "../constants";

import IBloGenOptions from "../interfaces/IBlogGenOptions";

const BlogGenInitDirs = async ({ distRoot }: IBloGenOptions) => {
  await ensureDir(distRoot);
  await emptyDir(distRoot);
  await ensureDir(distRoot + constants.assetPath);
};

export default BlogGenInitDirs;
