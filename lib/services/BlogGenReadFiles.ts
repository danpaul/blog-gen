import IBloGenOptions from "../interfaces/IBlogGenOptions";
import * as fs from "fs/promises";

const BlogGenReadFiles = async ({ contentRoot }: IBloGenOptions) => {
  return fs.readdir(contentRoot, { withFileTypes: true });
};

export default BlogGenReadFiles;
