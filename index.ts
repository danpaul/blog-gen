import IBloGenOptions from "./lib/interfaces/IBlogGenOptions";
import BlogGenInitDirs from "./lib/services/BlogGenInitDirs";
import BlogGenReadFiles from "./lib/services/BlogGenReadFiles";

const BlogGen = async (options: IBloGenOptions) => {
  await BlogGenInitDirs(options);
};

export { BlogGen, BlogGenInitDirs, BlogGenReadFiles, IBloGenOptions };
