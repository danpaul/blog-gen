import { ensureDir, emptyDir } from "fs-extra";
import constants from "../constants";
const BlogGenInitDirs = async ({ distRoot }) => {
    await ensureDir(distRoot);
    await emptyDir(distRoot);
    await ensureDir(distRoot + constants.assetPath);
};
export default BlogGenInitDirs;
