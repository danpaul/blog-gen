import BlogGen from "./BlogGen/BlogGen";
import { GetBlogGenOptions } from "./BlogGen/Options";

// ASDF
const IS_TESTING = true;
const TESTING_DIR = __dirname + "/../test/blog";

(async () => {
  const options = await GetBlogGenOptions(
    IS_TESTING ? { contentRoot: TESTING_DIR } : null
  );
  const blogGen = new BlogGen(options);
  await blogGen.run();
  console.log("BlogGen is done!");
})();
