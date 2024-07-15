import BlogGen from "./lib/BlogGen/BlogGen";
import { GetBlogGenOptions } from "./lib/BlogGen/Options";

const IS_TESTING = false;
const TESTING_DIR = __dirname + "/../test/blog";

(async () => {
  const options = await GetBlogGenOptions(
    IS_TESTING ? { contentRoot: TESTING_DIR } : null
  );
  const blogGen = new BlogGen(options);
  await blogGen.run();
  console.log("BlogGen is done!");
})();
